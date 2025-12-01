import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";
import type { AccidentFacts } from "./extractAccidentFacts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration constants
const SITE_NAME = "AccidentFacts";
const REPORT_SERVICE_PHRASE = `${SITE_NAME} is not a law firm and does not create official police reports. Our free service helps you find and request the official crash report from the correct agency and connect with additional resources if needed.`;

// Required headings for validation (in order)
const REQUIRED_HEADINGS = [
  "## Key Facts",
  "## What We Know About the Crash",
  "## People Involved and Injuries",
  "## Investigation and Possible Contributing Factors",
  "## Traffic Impact",
  "## What to Do If You Were Involved in This Crash",
  "## How to Get the Official Crash Report",
  "## Legal Disclaimer and Sources",
];

interface IncidentData {
  headline: string;
  summary?: string | null;
  city?: string | null;
  state?: string | null;
  occurredAt: Date;
  sources?: { title: string; snippet?: string | null }[];
}

interface SeoContent {
  seoTitle: string;
  seoDescription: string;
  articleBody: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
}

interface ArticleMetaBlock {
  seo_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string[];
}

/**
 * Load the article prompt template from the prompts directory.
 * Replaces placeholders with actual values.
 */
function loadPromptTemplate(): string {
  const promptPath = join(process.cwd(), "lib/seo/prompts/article-prompt.md");
  let template = readFileSync(promptPath, "utf-8");

  // Replace placeholders
  template = template.replace(/\{\{SITE_NAME\}\}/g, SITE_NAME);
  template = template.replace(/\{\{REPORT_SERVICE_PHRASE\}\}/g, REPORT_SERVICE_PHRASE);

  return template;
}

/**
 * Validate that the generated article contains all required headings.
 * Returns an array of missing headings, or empty array if all present.
 */
function validateHeadings(articleBody: string): string[] {
  const missing: string[] = [];

  for (const heading of REQUIRED_HEADINGS) {
    if (!articleBody.includes(heading)) {
      missing.push(heading);
    }
  }

  return missing;
}

/**
 * Parse the AI response to extract the JSON meta block and markdown body.
 * The response format is:
 * ```json
 * { "seo_title": "...", ... }
 * ```
 * # Headline
 * ... rest of article ...
 */
function parseArticleResponse(content: string): {
  meta: ArticleMetaBlock | null;
  body: string;
} {
  // Try to extract JSON block from the beginning
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const jsonMatch = content.match(jsonBlockRegex);

  let meta: ArticleMetaBlock | null = null;
  let body = content;

  if (jsonMatch) {
    try {
      meta = JSON.parse(jsonMatch[1]) as ArticleMetaBlock;
      // Remove the JSON block from the body
      body = content.replace(jsonBlockRegex, "").trim();
    } catch (e) {
      console.error("[SEO] Failed to parse meta JSON block:", e);
    }
  }

  return { meta, body };
}

/**
 * Generate SEO-optimized article content for an incident using OpenAI.
 *
 * Uses the 12-section article format defined in lib/seo/prompts/article-prompt.md.
 * When extractedFacts are provided, the article will include specific details
 * about companies, vehicles, people, agencies, and other case-relevant information.
 *
 * @param incident - Basic incident data
 * @param facts - Optional extracted facts for richer content
 * @param retryCount - Internal retry counter (max 1 retry on validation failure)
 */
export async function generateIncidentArticle(
  incident: IncidentData,
  facts?: AccidentFacts | null,
  retryCount: number = 0
): Promise<SeoContent | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.log("[SEO] OpenAI API key not configured, skipping article generation");
    return null;
  }

  // Load the prompt template
  let promptTemplate: string;
  try {
    promptTemplate = loadPromptTemplate();
  } catch (error) {
    console.error("[SEO] Failed to load prompt template:", error);
    return null;
  }

  // Build location string, preferring extracted facts
  const location = facts?.primaryLocation ??
    ([incident.city, incident.state].filter(Boolean).join(", ") ||
    "the reported area");

  const dateStr = incident.occurredAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Gather source snippets for context
  const sourceContext = incident.sources
    ?.slice(0, 5)
    .map((s) => `- ${s.title}${s.snippet ? `: ${s.snippet}` : ""}`)
    .join("\n") || "";

  // Build entity summaries from extracted facts
  const companies = facts?.companiesMentioned?.join(", ") || "none specified";
  const vehicles = facts?.vehicles?.map((v) =>
    v.ownerCompany ? `${v.type} (${v.ownerCompany})` : v.type
  ).join(", ") || "not specified";
  const agencies = facts?.agenciesInvolved?.join(", ") || "not specified";
  const roads = facts?.roads?.join(", ") || "not specified";
  const peopleDescriptions = facts?.peopleInvolved?.map((p) => {
    const parts = [p.role];
    if (p.description) parts.push(p.description);
    if (p.age) parts.push(`age ${p.age}`);
    if (p.status) parts.push(`(${p.status})`);
    return parts.join(", ");
  }).join("; ") || "not specified";

  // Build the user prompt with incident data
  let userPrompt: string;

  if (facts) {
    userPrompt = `Generate a complete article following the exact format specified in your instructions.

INCIDENT HEADLINE:
${incident.headline}

EXTRACTED FACTS (use these as your primary source):
${JSON.stringify(facts, null, 2)}

BASIC INFO:
- Date: ${dateStr}
- Location: ${location}
- Companies mentioned: ${companies}
- Vehicles involved: ${vehicles}
- Roads: ${roads}
- Agencies: ${agencies}
- People involved: ${peopleDescriptions}
- Injuries: ${facts.injuriesCount || "not specified"}
- Fatalities: ${facts.fatalitiesCount || "not specified"}
- Time of crash: ${facts.timeOfCrashApprox || "not specified"}
- Cause/allegations: ${facts.causeOrAllegations || "not specified"}

NEWS SOURCES:
${sourceContext || "No additional sources"}

Remember:
1. Start with the JSON meta block inside \`\`\`json ... \`\`\`
2. Then the # Headline
3. Then all required sections with exact headings
4. Use only facts provided - do not invent details`;
  } else {
    // Fallback prompt when no facts are available
    userPrompt = `Generate a complete article following the exact format specified in your instructions.

INCIDENT DETAILS:
- Headline: ${incident.headline}
- Location: ${location}
- Date: ${dateStr}
- Summary: ${incident.summary || "No summary available"}

NEWS SOURCES:
${sourceContext || "No additional sources"}

Remember:
1. Start with the JSON meta block inside \`\`\`json ... \`\`\`
2. Then the # Headline
3. Then all required sections with exact headings
4. Use ONLY information from the headline, summary, and news sources
5. If something is not known, say so plainly (e.g., "identities have not been released")`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: promptTemplate,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 5500,
      temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("[SEO] Empty response from OpenAI");
      return null;
    }

    // Parse the response
    const { meta, body } = parseArticleResponse(content);

    // Validate required headings
    const missingHeadings = validateHeadings(body);
    if (missingHeadings.length > 0) {
      console.warn("[SEO] Missing required headings:", missingHeadings);

      // Retry once if headings are missing
      if (retryCount < 1) {
        console.log("[SEO] Retrying article generation...");
        return generateIncidentArticle(incident, facts, retryCount + 1);
      }

      console.error("[SEO] Article validation failed after retry, proceeding with partial article");
    }

    // Extract SEO fields from meta block or generate fallbacks
    const seoTitle = meta?.seo_title ||
      `${incident.city || "Local"} Crash Report - ${dateStr}`.slice(0, 70);
    const seoDescription = meta?.meta_description ||
      `Details about a crash in ${location} on ${dateStr}. Learn what happened and how to get the official report.`.slice(0, 170);

    return {
      seoTitle: seoTitle.slice(0, 70),
      seoDescription: seoDescription.slice(0, 170),
      articleBody: body,
      primaryKeyword: meta?.primary_keyword,
      secondaryKeywords: meta?.secondary_keywords,
    };
  } catch (error) {
    console.error("[SEO] Failed to generate article:", error);
    return null;
  }
}
