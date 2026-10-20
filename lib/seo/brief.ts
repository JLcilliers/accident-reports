import OpenAI from "openai";
import { stripHtmlAndPublisher } from "../text";
import { findCopiedRun, validateIncidentBrief } from "./validateIncidentArticle";

// Lazy-initialized OpenRouter client (created on first use to allow dotenv to run first)
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

const DEFAULT_ARTICLE_MODEL = "anthropic/claude-haiku-5.5";

/**
 * Starts the stored body of every brief. The page, the sitemap and the article job use it to tell a brief
 * (noindex, out of the sitemap, replaced by a full article once a second publisher reports the crash) from an
 * article.
 */
export const BRIEF_MARKER = "## News Brief\n\n";

export function isBrief(articleBody: string | null | undefined): articleBody is string {
  return !!articleBody?.startsWith(BRIEF_MARKER);
}

const INSTRUCTIONS = `You write short news briefs for CarCrashReport.com about road crashes that only one news outlet has reported so far. All you have is that outlet's headline, its name, the date it was published and the place.

Write 110 to 160 words in two or three plain paragraphs:
- First, what the headline reports, credited to the outlet by name with the date (for example "KTLA reported on October 20, 2026, that ..."), in your own words.
- Then, briefly, which details the headline leaves open (such as the cause, who was involved or their injuries) and that no other outlet has confirmed them yet.
- Last, in general terms, that the official crash report is kept by the law-enforcement agency that handled the crash and that people involved can ask that agency for a copy.

Rules:
- Use only what the headline says. Never add names, ages, times, roads, vehicles, injuries, causes or numbers it does not give.
- No headings, lists, links, web addresses, phone numbers or email addresses.
- Do not mention law firms, lawyers, compensation or legal claims, and do not say the story will be updated or ask readers to check back.
- Restate the headline; do not copy it word for word.
- Neutral, factual tone with no sensational words.

Return only the text of the brief.`;

/**
 * Writes a 100 to 180 word brief from the one headline a single publisher has run, credited to that publisher
 * and dated, through OpenRouter (ARTICLE_MODEL). Returns the body to store, starting with BRIEF_MARKER.
 * Throws when the model gives no text or the brief fails validateIncidentBrief or repeats 12 or more words of
 * the coverage, so the caller can fall back to waiting for a second publisher.
 */
export async function generateIncidentBrief(incident: {
  headline: string;
  city?: string | null;
  state?: string | null;
  occurredAt: Date;
  sources: { title: string; snippet?: string | null; publisher?: string | null }[];
}): Promise<string> {
  const headline = stripHtmlAndPublisher(incident.headline) ?? incident.headline;
  const outlet = incident.sources.find((s) => s.publisher?.trim())?.publisher?.trim() ?? "a local news outlet";
  const date = incident.occurredAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const place = [incident.city, incident.state].filter(Boolean).join(", ") || "not given";

  const response = await getOpenAI().chat.completions.create({
    model: process.env.ARTICLE_MODEL || DEFAULT_ARTICLE_MODEL,
    messages: [
      { role: "system", content: INSTRUCTIONS },
      { role: "user", content: `Headline: ${headline}\nOutlet: ${outlet}\nPublished: ${date}\nPlace: ${place}` },
    ],
    // Haiku 5.5 spends up to ~4,100 reasoning tokens before writing, so leave room for both
    max_tokens: 8000,
    temperature: 0.4,
  }, { timeout: 40_000, maxRetries: 0 }); // A slow brief is dropped rather than eating the cron run's time.

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("No brief generated");

  const validation = validateIncidentBrief(text);
  if (!validation.ok) throw new Error(`Generated brief failed validation: ${validation.errors.join("; ")}`);
  const copied = findCopiedRun(text, [incident.headline, ...incident.sources.flatMap((s) => [s.title, s.snippet ?? ""])]);
  if (copied) throw new Error(`Generated brief repeats 12 or more words of a source: "${copied}"`);

  return BRIEF_MARKER + text;
}
