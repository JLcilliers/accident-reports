import OpenAI from "openai";

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
 * Generate SEO-optimized article content for an incident using OpenAI
 */
export async function generateIncidentArticle(
  incident: IncidentData
): Promise<SeoContent | null> {
  // Skip if no API key configured
  if (!process.env.OPENAI_API_KEY) {
    console.log("[SEO] OpenAI API key not configured, skipping article generation");
    return null;
  }

  const location = [incident.city, incident.state].filter(Boolean).join(", ");
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

  const prompt = `You are a professional news writer for an accident reporting website. Generate SEO-optimized content for the following traffic accident.

INCIDENT DETAILS:
- Headline: ${incident.headline}
- Location: ${location || "Unknown location"}
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

   Format the article with proper paragraphs. Do not use markdown headers or bullet points in the articleBody.

Respond with valid JSON only, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional news article writer. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("[SEO] Empty response from OpenAI");
      return null;
    }

    const parsed = JSON.parse(content) as SeoContent;

    // Validate required fields
    if (!parsed.seoTitle || !parsed.seoDescription || !parsed.articleBody) {
      console.error("[SEO] Missing required fields in OpenAI response");
      return null;
    }

    return {
      seoTitle: parsed.seoTitle.slice(0, 70), // Enforce max length
      seoDescription: parsed.seoDescription.slice(0, 170),
      articleBody: parsed.articleBody,
    };
  } catch (error) {
    console.error("[SEO] Failed to generate article:", error);
    return null;
  }
}
