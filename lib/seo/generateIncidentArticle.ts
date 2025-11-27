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

  const articleFormatInstructions = `
================================
ARTICLE FORMAT - OUTPUT MUST FOLLOW THIS EXACTLY
================================

Your articleBody must contain ONLY these two sections, in this exact order:

1) A "Key Takeaways" section
2) A "Summary of the Incident" section

Do NOT add any other sections, headings, conclusions, or commentary.

================================
SECTION 1: "Key Takeaways"
================================

- Start with this exact H2 heading:
  ## Key Takeaways

- Under it, write 4–6 short bullet points.

- Use this pattern for the bullets (labels in **bold** followed by concise explanation):

  • **Where & when:**
    - Clear location and time.
    - Include road name/number, direction if given, nearest exit or landmark, city, state, and approximate time with time zone if available.

  • **What happened:**
    - 1–2 sentences summarising the basic sequence of events in plain language.
    - Clearly identify key vehicles (with year/make/model if provided) and the order of impacts.

  • **Casualties:**
    - Who was killed or injured and how many.
    - Use available details such as "pronounced dead at the scene," "taken to hospital in critical condition," "non-life-threatening injuries," etc.
    - If casualty information is unknown or not released, state that without guessing.

  • **Notable details:**
    - Optional bullet, only if relevant.
    - Include any detail that increases public interest:
      - involvement of law enforcement,
      - commercial vehicles (e.g., FedEx, UPS),
      - hazardous materials,
      - children, school buses, etc.

  • **Response:**
    - Reference statements or actions from:
      - local police, fire/EMS, DOT, or
      - companies/agencies involved (e.g., a trucking company issuing condolences and confirming cooperation).
    - If no statement is known, say that authorities state the investigation is ongoing.

- Each bullet should be 1–2 sentences.
- Tone: neutral, factual, and respectful.
- Do NOT speculate about fault or causes.

================================
SECTION 2: "Summary of the Incident"
================================

- Use this exact H2 heading:
  ## Summary of the Incident

- Write 2–5 short paragraphs in neutral, factual language.

- First paragraph:
  - Attribute the information to named authorities if provided (e.g., "According to the Memphis Police Department (MPD) and the Tennessee Department of Transportation (TDOT)…").
  - Clearly state:
    - the type of crash (multi-vehicle, rear-end, rollover, etc., if known),
    - the road, direction, and nearest interchange/landmark,
    - the city and state,
    - the date and approximate time in local time.

- Middle paragraphs:
  - Describe the sequence of events in chronological order:
    - what first happened,
    - how other vehicles became involved,
    - whether any vehicles were already stopped from a prior crash,
    - any secondary collisions.
  - Clarify which vehicle struck which vehicle(s) and in what order, based on the provided facts.
  - Include:
    - the number of people injured or killed,
    - their conditions (fatal, critical, serious, minor, unknown),
    - whether they were inside vehicles or standing outside when they were struck.
  - Mention impacts on traffic where known:
    - lane closures,
    - full interstate shutdowns,
    - approximate duration or "for several hours" if no exact time is given.

- If a company or agency is involved (e.g., FedEx truck, police vehicle, federal agent, school district bus):
  - Integrate any public statements such as condolences or confirmation of cooperation with investigators.
  - Note law-enforcement or public-interest angles factually.

- Final paragraph:
  - Briefly describe the current status:
    - "The crash remains under investigation,"
    - "No charges have been announced,"
    - or similar.
  - Do NOT assign blame or speculate about liability, intoxication, speeding, or distraction unless that is explicitly included in the provided facts.

================================
TONE, FACTUAL LIMITS, AND SEO BEHAVIOR
================================

- Tone:
  - Neutral, factual, respectful.
  - No sensational language.
  - No graphic descriptions of injuries.

- Facts:
  - Use ONLY information provided in the input or clearly implied by it.
  - If something is not known (e.g., identities not released, exact cause), say so plainly.
  - Never invent names, ages, vehicle models, or quotes.

- SEO (internal guidance — do NOT mention SEO in the article):
  - Naturally weave in:
    - road name/number (e.g., "I-240 East"),
    - nearby junctions (e.g., "near Airways Boulevard"),
    - city and state,
    - company names (e.g., "FedEx truck"),
    - vehicle makes/models/years (e.g., "2024 Toyota Corolla"),
    - outcome terms like "crash," "collision," "fatality," "critical injury," "semi-truck," etc.
  - Keep sentences readable and normal; do not repeat phrases awkwardly just for keywords.
`;

  if (facts) {
    prompt = `You are an AI writer for a traffic-incident reporting website.

Your job is to take structured crash facts and turn them into a clear, SEO-aware public incident report.

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
- Time of crash: ${facts.timeOfCrashApprox || "not specified"}

NEWS SOURCES:
${sourceContext || "No additional sources"}

${articleFormatInstructions}

TASKS:
1. seoTitle (max ~65 chars): Include location and key entities when present.
   Example: "FedEx Truck Crash on I-95 in Georgia Injures 3 Drivers"

2. seoDescription (max ~155 chars): Include location, crash type, and companies if mentioned.

3. articleBody: Follow the ARTICLE FORMAT instructions above EXACTLY. Output only the two sections: Key Takeaways and Summary of the Incident.

Return strict JSON: { "seoTitle": string, "seoDescription": string, "articleBody": string }`;
  } else {
    // Fallback prompt when no facts are available
    prompt = `You are an AI writer for a traffic-incident reporting website.

Your job is to take crash information and turn it into a clear, SEO-aware public incident report.

INCIDENT DETAILS:
- Headline: ${incident.headline}
- Location: ${location}
- Date: ${dateStr}
- Summary: ${incident.summary || "No summary available"}

NEWS SOURCES:
${sourceContext || "No additional sources"}

${articleFormatInstructions}

TASKS:
1. seoTitle: An SEO-optimized title (50-60 characters) that includes the location and key details.

2. seoDescription: A meta description (150-160 characters) summarizing the incident.

3. articleBody: Follow the ARTICLE FORMAT instructions above EXACTLY. Output only the two sections: Key Takeaways and Summary of the Incident.

   Use ONLY information from the headline, summary, and news sources. Do NOT make up specific details like names, exact injuries, or outcomes that aren't in the source material. If something is not known, say so plainly (e.g., "identities have not been released" or "authorities are investigating").

Respond with valid JSON only: { "seoTitle": string, "seoDescription": string, "articleBody": string }`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI writer for a traffic-incident reporting website. You write clear, SEO-aware public incident reports with exactly two sections: Key Takeaways (bullet points) and Summary of the Incident (paragraphs). Always respond with valid JSON only. Be factual, neutral, and respectful. Never invent details or speculate about fault.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2500, // Increased for structured two-section format
      temperature: 0.5,
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
