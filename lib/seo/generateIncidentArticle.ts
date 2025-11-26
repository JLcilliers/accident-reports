import OpenAI from "openai";
import type { AccidentFacts } from "./extractAccidentFacts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
}

/**
 * Generate SEO-optimized article content for an incident using OpenAI.
 *
 * When extractedFacts are provided, the article will include specific details
 * about companies, vehicles, people, agencies, and other case-relevant information.
 *
 * @param incident - Basic incident data
 * @param facts - Optional extracted facts for richer content
 */
export async function generateIncidentArticle(
  incident: IncidentData,
  facts?: AccidentFacts | null
): Promise<SeoContent | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.log("[SEO] OpenAI API key not configured, skipping article generation");
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

  // Build the prompt - richer when facts are available
  let prompt: string;

  if (facts) {
    prompt = `You are writing a factual, SEO-friendly article about a specific traffic accident for people searching online.

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
- Injuries: ${facts.injuriesCount || "not specified"}
- Fatalities: ${facts.fatalitiesCount || "not specified"}

NEWS SOURCES:
${sourceContext || "No additional sources"}

RULES:
- Use ONLY facts from the headline or extracted facts. Do NOT invent details.
- Mention important entities for legal/news interest: companies (${companies}), vehicles, agencies.
- If something is not in the facts, say "not specified in initial reports".
- Do NOT assign legal fault or liability.
- Avoid clickbait; keep a neutral, informative tone.

TASKS:
1. seoTitle (max ~65 chars): Include location and key entities when present.
   Example: "FedEx Truck Crash on I-95 in Georgia Injures 3 Drivers"

2. seoDescription (max ~155 chars): Include location, crash type, and companies if mentioned.

3. articleBody (500-800 words) with these sections (use paragraph breaks, no markdown headers):

   WHAT HAPPENED IN THE CRASH
   - Describe the incident using only stated facts
   - Mention time of crash if known: "${facts.timeOfCrashApprox || "not specified"}"
   - Include roads/location details

   VEHICLES AND PEOPLE INVOLVED
   - List company vehicles (e.g., FedEx truck) if mentioned
   - Count of people injured/killed, even if approximate
   - Describe roles of people involved

   EMERGENCY RESPONSE AND TRAFFIC IMPACT
   - Agencies that responded: ${agencies}
   - Any road closures or traffic impacts mentioned

   WHAT THIS MEANS FOR DRIVERS AND FAMILIES
   - General post-accident advice: medical care, preserving evidence, requesting reports
   - Suggest contacting a lawyer if injuries occurred

Return strict JSON: { "seoTitle": string, "seoDescription": string, "articleBody": string }`;
  } else {
    // Fallback prompt when no facts are available
    prompt = `You are a professional news writer for an accident reporting website. Generate SEO-optimized content for the following traffic accident.

INCIDENT DETAILS:
- Headline: ${incident.headline}
- Location: ${location}
- Date: ${dateStr}
- Summary: ${incident.summary || "No summary available"}

NEWS SOURCES:
${sourceContext || "No additional sources"}

Generate the following in JSON format:

1. seoTitle: An SEO-optimized title (50-60 characters) that includes the location and key details. Should be compelling for search results.

2. seoDescription: A meta description (150-160 characters) summarizing the incident. Should include location and encourage clicks.

3. articleBody: A comprehensive 400-700 word article covering:
   - What happened (based on available information)
   - When and where it occurred
   - Impact on the community and traffic
   - General safety tips relevant to this type of incident
   - Information about seeking legal help if injured

   Write in a professional, informative tone. Do NOT make up specific details like names, exact injuries, or outcomes that aren't in the source material. Use phrases like "according to reports" or "authorities are investigating" when appropriate.

   Format the article with proper paragraphs. Do not use markdown headers or bullet points.

Respond with valid JSON only: { "seoTitle": string, "seoDescription": string, "articleBody": string }`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional news article writer specializing in traffic accident reporting. Always respond with valid JSON only. Be factual and never invent details.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000, // Increased for longer articles
      temperature: 0.5, // Slightly lower for more consistent output
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("[SEO] Empty response from OpenAI");
      return null;
    }

    const parsed = JSON.parse(content) as SeoContent;

    if (!parsed.seoTitle || !parsed.seoDescription || !parsed.articleBody) {
      console.error("[SEO] Missing required fields in OpenAI response");
      return null;
    }

    return {
      seoTitle: parsed.seoTitle.slice(0, 70),
      seoDescription: parsed.seoDescription.slice(0, 170),
      articleBody: parsed.articleBody,
    };
  } catch (error) {
    console.error("[SEO] Failed to generate article:", error);
    return null;
  }
}
