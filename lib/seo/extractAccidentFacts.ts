import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Structured facts extracted from accident news coverage.
 * Used to enrich SEO content and display key details on incident pages.
 */
export interface AccidentFacts {
  primaryLocation: string | null;       // "Near Exit 23 on I-240 in Memphis, Tennessee"
  city: string | null;                  // "Memphis"
  county: string | null;                // "Shelby County"
  state: string | null;                 // "TN"
  roads: string[];                      // ["I-240", "West Marginal Way"]
  timeOfCrashApprox: string | null;     // "around 4:30 a.m.", "early morning"
  peopleInvolved: {
    role: string;                       // "driver", "passenger", "pedestrian", "trooper"
    description: string;                // "FedEx truck driver", "3 children"
    age: string | null;                 // "35", "8-year-old", or null
    status: string | null;              // "injured", "killed", "uninjured", or null
  }[];
  vehicles: {
    type: string;                       // "FedEx box truck", "SUV", "semi-truck"
    ownerCompany: string | null;        // "FedEx", "Amazon", null
  }[];
  companiesMentioned: string[];         // ["FedEx", "TDOT"]
  agenciesInvolved: string[];           // ["Tennessee Department of Transportation", "Memphis Police Department"]
  injuriesCount: string | null;         // "3 injured", "multiple injuries", null
  fatalitiesCount: string | null;       // "1 killed", "no fatalities reported", null
  causeOrAllegations: string | null;    // "driver lost control on icy road", or "not specified in reports"
}

/**
 * Extract structured facts from accident news coverage using OpenAI.
 *
 * This function performs forensic extraction of all case-relevant details
 * from news articles, including companies, vehicles, people, agencies, etc.
 *
 * @param headline - The incident headline
 * @param combinedText - Combined text from news sources (title + snippets)
 * @returns Structured AccidentFacts or null on error
 */
export async function extractAccidentFacts(
  headline: string,
  combinedText: string
): Promise<AccidentFacts | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.log("[FactExtraction] OpenAI API key not configured, skipping");
    return null;
  }

  const prompt = `You are extracting structured facts about a specific traffic accident.

Rules:
- Use ONLY information that is clearly stated in the text.
- If something is not clearly stated, set the field to null or an empty array.
- Do NOT guess, infer fault, or add details that are not explicitly reported.
- If reports say "multiple injuries" or "several people", capture that phrase as injuriesCount.
- If a company is mentioned (e.g. "FedEx truck"), include "FedEx" in companiesMentioned and in the vehicle.ownerCompany.
- Time can be approximate ("about 4:30 a.m.", "early morning").
- If the cause is not clear, set causeOrAllegations to "not specified in reports".
- For roads, include highways (I-95, US-1), local roads, intersections mentioned.
- For agencies, include police departments, fire departments, DOT, state patrol, etc.

Headline:
${headline}

Article / coverage text:
${combinedText}

Respond with valid JSON only matching this structure:
{
  "primaryLocation": string | null,
  "city": string | null,
  "county": string | null,
  "state": string | null (use state abbreviation like "TN", "CA"),
  "roads": string[],
  "timeOfCrashApprox": string | null,
  "peopleInvolved": [{ "role": string, "description": string, "age": string | null, "status": string | null }],
  "vehicles": [{ "type": string, "ownerCompany": string | null }],
  "companiesMentioned": string[],
  "agenciesInvolved": string[],
  "injuriesCount": string | null,
  "fatalitiesCount": string | null,
  "causeOrAllegations": string | null
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a forensic fact extractor for traffic accident reports. Extract ONLY explicitly stated facts. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.3, // Lower temperature for more consistent extraction
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("[FactExtraction] Empty response from OpenAI");
      return null;
    }

    const parsed = JSON.parse(content) as AccidentFacts;

    // Validate and ensure arrays are initialized
    return {
      primaryLocation: parsed.primaryLocation ?? null,
      city: parsed.city ?? null,
      county: parsed.county ?? null,
      state: parsed.state ?? null,
      roads: Array.isArray(parsed.roads) ? parsed.roads : [],
      timeOfCrashApprox: parsed.timeOfCrashApprox ?? null,
      peopleInvolved: Array.isArray(parsed.peopleInvolved) ? parsed.peopleInvolved : [],
      vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [],
      companiesMentioned: Array.isArray(parsed.companiesMentioned) ? parsed.companiesMentioned : [],
      agenciesInvolved: Array.isArray(parsed.agenciesInvolved) ? parsed.agenciesInvolved : [],
      injuriesCount: parsed.injuriesCount ?? null,
      fatalitiesCount: parsed.fatalitiesCount ?? null,
      causeOrAllegations: parsed.causeOrAllegations ?? null,
    };
  } catch (error) {
    console.error("[FactExtraction] Failed to extract facts:", error);
    return null;
  }
}
