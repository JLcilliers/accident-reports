import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";
import type { AccidentFacts } from "./extractAccidentFacts";
import {
  findCopiedRun,
  findCopiedRuns,
  validateIncidentArticle,
  type ArticleValidationResult,
} from "./validateIncidentArticle";
import { cleanRssSnippet } from "../text";

// Lazy-initialized OpenAI client (created on first use to allow dotenv to run first)
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }
  return openaiClient;
}

// Configuration constants
const SITE_NAME = "CarCrashReport.com";
const DEFAULT_ARTICLE_MODEL = "anthropic/claude-haiku-5.5";

// Word budget for the reporting sections, scaled to the source text so a thin story stays short,
// plus an allowance for the fixed general sections (what to do, how to get the report, disclaimer).
const REPORTING_WORDS_PER_SOURCE_WORD = 3;
const MIN_REPORTING_WORDS = 80;
const MAX_REPORTING_WORDS = 450;
const GENERAL_SECTION_WORDS = 320;

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

interface IncidentData {
  headline: string;
  summary?: string | null;
  city?: string | null;
  state?: string | null;
  occurredAt: Date;
  sources?: { title: string; snippet?: string | null; publisher?: string | null }[];
  /** The story's text from a publisher's own site (see fetchPublisherText). Never stored or shown. */
  publisherText?: string | null;
}

/**
 * The distinct texts the sources give us: each title, plus the cleaned snippet when it says more than the title.
 * Google News snippets are usually just the headline and publisher again.
 */
export function incidentSourceTexts(sources: { title: string; snippet?: string | null }[]): string[] {
  const texts = new Set<string>();
  for (const source of sources) {
    const title = source.title.trim();
    if (title) texts.add(title);
    const snippet = cleanRssSnippet(source.snippet);
    const headline = title.replace(/\s+-\s+[^-]+$/, "");
    if (snippet && !snippet.startsWith(headline)) texts.add(snippet);
  }
  return [...texts];
}

/** Markdown link to the state's crash report guide, or null when the state isn't known. */
function stateGuideLink(state?: string | null): string | null {
  const name = state ? STATE_NAMES[state.trim().toUpperCase()] : undefined;
  if (!name) return null;
  return `[${name} crash report guide](/crash-reports/${name.toLowerCase().replace(/ /g, "-")})`;
}

interface SeoContent {
  seoTitle: string;
  seoDescription: string;
  articleBody: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  validation?: ArticleValidationResult;
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

  return template;
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
 * Generate SEO-optimized article content for an incident through OpenRouter (ARTICLE_MODEL).
 *
 * Uses the article format defined in lib/seo/prompts/article-prompt.md.
 * When extractedFacts are provided, the article will include specific details
 * about companies, vehicles, people, agencies, and other case-relevant information.
 * Makes one model call; a draft that fails the article check or repeats 12 or more words
 * of a source in a row throws, and the caller decides whether to try again.
 *
 * @param incident - Basic incident data
 * @param facts - Optional extracted facts for richer content
 */
export async function generateIncidentArticle(
  incident: IncidentData,
  facts?: AccidentFacts | null
): Promise<SeoContent | null> {
  if (!process.env.OPENROUTER_API_KEY) {
    console.log("[SEO] OpenRouter API key not configured, skipping article generation");
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

  // Gather source text for context, and size the article to it
  const sourceTexts = incidentSourceTexts(incident.sources?.slice(0, 5) ?? []);
  const publisherText = incident.publisherText?.trim() || "";
  const sourceContext = [
    ...sourceTexts.map((text) => `- ${text}`),
    ...(publisherText ? [`\nFULL STORY FROM A PUBLISHER'S SITE (the fullest account; use its facts, never its wording):\n${publisherText}`] : []),
  ].join("\n");
  const publishers = [...new Set((incident.sources ?? []).map((s) => s.publisher?.trim()).filter(Boolean))].join(", ") || "not named";
  const sourceWords = [...sourceTexts, publisherText].join(" ").split(/\s+/).filter(Boolean).length;
  const reportingWords = Math.min(
    MAX_REPORTING_WORDS,
    Math.max(MIN_REPORTING_WORDS, sourceWords * REPORTING_WORDS_PER_SOURCE_WORD)
  );
  const maxWords = reportingWords + GENERAL_SECTION_WORDS;
  const guideLink = stateGuideLink(incident.state ?? facts?.state);
  const articleNotes = `WORD BUDGET: at most ${reportingWords} words for the reporting sections (Key Facts through Traffic Impact) and at most ${maxWords} words for the whole article. Shorter is fine when the sources say little.
STATE CRASH REPORT GUIDE LINK: ${guideLink ?? "none (do not link to any guide)"}${publisherText ? `
PUBLISHER'S STORY: take only its facts. Restate each one in a sentence built your own way, with different wording and order; no 12 consecutive words may match the story, not even a list of vehicles or a description of injuries.` : ""}`;

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
- Date first reported: ${dateStr}
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

NEWS SOURCES (published by: ${publishers}):
${sourceContext || "No additional sources"}

${articleNotes}

Remember:
1. Start with the JSON meta block inside \`\`\`json ... \`\`\`
2. Then the # Headline
3. Then all required sections with exact headings
4. Use only facts provided - do not invent details, and leave out anything marked "not specified"`;
  } else {
    // Fallback prompt when no facts are available
    userPrompt = `Generate a complete article following the exact format specified in your instructions.

INCIDENT DETAILS:
- Headline: ${incident.headline}
- Location: ${location}
- Date first reported: ${dateStr}
- Summary: ${incident.summary || "No summary available"}

NEWS SOURCES (published by: ${publishers}):
${sourceContext || "No additional sources"}

${articleNotes}

Remember:
1. Start with the JSON meta block inside \`\`\`json ... \`\`\`
2. Then the # Headline
3. Then all required sections with exact headings
4. Use ONLY information from the headline, summary, and news sources
5. If something is not known, leave it out`;
  }

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: promptTemplate,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    // Given a publisher's full story, the model tends to keep its wording for plain facts such as a list of
    // vehicles, so a draft that repeats a source gets one rewrite before the article fails.
    for (let draft = 1; ; draft++) {
      const response = await getOpenAI().chat.completions.create({
        model: process.env.ARTICLE_MODEL || DEFAULT_ARTICLE_MODEL,
        messages,
        // Haiku 5.5 spends up to ~4,100 reasoning tokens before writing, so leave room for both
        max_tokens: 8000,
        temperature: 0.4,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.error("[SEO] Empty response from OpenAI");
        return null;
      }

      // Parse the response
      const { meta, body } = parseArticleResponse(content);

      // Validate article using central validator
      const validation = validateIncidentArticle(body, { maxWords });

      if (!validation.ok) {
        console.warn("[SEO] Article validation failed:", {
          errors: validation.errors,
          warnings: validation.warnings,
          headline: incident.headline,
        });
        throw new Error(
          `Generated article failed validation: ${validation.errors.join("; ")}`
        );
      }

      const copied = findCopiedRun(body, [incident.headline, incident.summary ?? "", ...sourceTexts]);
      const copiedFromPublisher = !copied && publisherText ? findCopiedRun(body, [publisherText]) : null;
      if (copied || copiedFromPublisher) {
        if (draft === 1) {
          const passages = findCopiedRuns(body, [incident.headline, incident.summary ?? "", ...sourceTexts, publisherText]);
          messages.push(
            { role: "assistant", content },
            {
              role: "user",
              content: `Your article repeats these passages from the sources word for word:\n${passages.map((passage) => `- "${passage}"`).join("\n")}\nRewrite every sentence that contains one in your own words, for example by regrouping or reordering the details, leave the rest as it is, and return the whole article in the same format.`,
            }
          );
          continue;
        }
        if (copied) {
          throw new Error(`Generated article repeats 12 or more words of a source: "${copied}"`);
        }
        // Not quoted, so none of the publisher's text ends up in the stored error notes.
        throw new Error("Generated article repeats 12 or more words of the publisher's story");
      }

      // Log warnings for tracking (but don't fail)
      if (validation.warnings.length > 0) {
        console.log("[SEO] Article warnings (review recommended):", {
          warnings: validation.warnings,
          headline: incident.headline,
        });
      }

      // Extract SEO fields from meta block or generate fallbacks
      const seoTitle =
        meta?.seo_title ||
        `${incident.city || "Local"} Crash Report - ${dateStr}`.slice(0, 70);
      const seoDescription =
        meta?.meta_description ||
        `Details about a crash in ${location} on ${dateStr}. Learn what happened and how to get the official report.`.slice(
          0,
          170
        );

      return {
        seoTitle: seoTitle.slice(0, 70),
        seoDescription: seoDescription.slice(0, 170),
        articleBody: body,
        primaryKeyword: meta?.primary_keyword,
        secondaryKeywords: meta?.secondary_keywords,
        // Include validation result for caller to use
        validation,
      };
    }
  } catch (error) {
    console.error("[SEO] Failed to generate article:", error);
    throw error; // Re-throw so caller can handle
  }
}
