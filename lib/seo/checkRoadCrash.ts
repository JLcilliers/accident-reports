import OpenAI from "openai";

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

const DEFAULT_CRASH_CHECK_MODEL = "google/gemini-2.5-flash-lite";

const INSTRUCTIONS = `You decide whether news coverage reports a real road crash.

Answer true when the coverage is about one specific crash on a road or street involving a car, truck, bus, motorcycle, bicycle or pedestrian, including follow-up coverage of that crash: victims identified, arrests, charges, court cases, road closures.

Answer false when it is:
- a press release, award, ranking or advert from a law firm or any other business
- a death or injury that did not happen in a road crash (amusement park ride, shooting, homicide, fall, medical event, boat, plane or train)
- a statistics roundup, trend, policy or safety-campaign story that does not report one specific crash
- anything else where no specific road crash is the event being reported

A story that only mentions an old crash in passing (for example in a person's biography) is false.

Respond with JSON only: {"crash": true or false, "reason": "one short sentence"}`;

export interface RoadCrashCheck {
  crash: boolean;
  reason: string;
}

/**
 * Asks a small model (CRASH_CHECK_MODEL) whether an incident's coverage reports a real road crash, so press
 * releases, deaths away from the road, statistics roundups and adverts never get an article.
 * Throws when the model gives no clear answer, so the caller counts it as a failed attempt.
 */
export async function checkRoadCrash(headline: string, sourceTexts: string[]): Promise<RoadCrashCheck> {
  const coverage = sourceTexts.map((text) => `- ${text}`).join("\n") || "- (no other coverage)";
  const response = await getOpenAI().chat.completions.create({
    model: process.env.CRASH_CHECK_MODEL || DEFAULT_CRASH_CHECK_MODEL,
    messages: [
      { role: "system", content: INSTRUCTIONS },
      { role: "user", content: `Headline:\n${headline}\n\nCoverage:\n${coverage}` },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
    temperature: 0,
  }, { timeout: 20_000, maxRetries: 1 }); // A short answer: a slow call fails fast instead of eating the cron run's time.

  return parseCrashCheck(response.choices[0]?.message?.content ?? "");
}

/**
 * Reads the first JSON object in the model's answer, so a code fence around it or a stray "}" after it
 * (gemini-2.5-flash-lite sometimes adds one) still gives the answer. Throws when there is no clear true or false.
 */
export function parseCrashCheck(content: string): RoadCrashCheck {
  let parsed: Partial<RoadCrashCheck> = {};
  const start = content.indexOf("{");
  for (let end = content.indexOf("}", start); start >= 0 && end >= 0; end = content.indexOf("}", end + 1)) {
    try {
      parsed = JSON.parse(content.slice(start, end + 1));
      break;
    } catch {
      // Not a whole object yet: try the next closing brace.
    }
  }
  if (typeof parsed.crash !== "boolean") {
    throw new Error(`Crash check gave no clear answer: ${content.slice(0, 200)}`);
  }
  return { crash: parsed.crash, reason: String(parsed.reason ?? "").slice(0, 300) };
}
