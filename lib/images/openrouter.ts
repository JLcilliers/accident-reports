const API = "https://openrouter.ai/api/v1";

export const IMAGE_MODEL = process.env.IMAGE_MODEL || "openai/gpt-5-image-mini";
export const IMAGE_QUALITY = process.env.IMAGE_QUALITY || "low";
export const CHECK_MODEL = process.env.IMAGE_CHECK_MODEL || "google/gemini-2.5-flash";

export interface ImageCheck {
  people: boolean;
  text: boolean;
  plates: boolean;
  gore: boolean;
  photorealistic: boolean;
}

/** A vision check that failed after it was billed, carrying what it cost so callers can still record it. */
export class ImageCheckError extends Error {
  constructor(message: string, readonly costUsd: number) {
    super(message);
    this.name = "ImageCheckError";
  }
}

function headers() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not configured");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://www.carcrashreport.com",
    "X-Title": "CarCrashReport.com",
  };
}

/** POSTs to OpenRouter and gives up at `deadline` (epoch ms) or after two minutes, whichever comes first. */
async function postJson(path: string, body: unknown, deadline = Infinity) {
  const timeoutMs = Math.floor(Math.min(120_000, deadline - Date.now()));
  if (timeoutMs < 1_000) throw new Error(`No time left in this run for OpenRouter ${path}`);
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`OpenRouter ${path} returned ${res.status} with a non-JSON body`);
  }
  if (!res.ok) {
    const err = json.error as { message?: string } | undefined;
    throw new Error(`OpenRouter ${path} returned ${res.status}: ${err?.message ?? "unknown error"}`);
  }
  return json;
}

// Below this, a run starts nothing: claimed incidents would only fail and never be tried again.
const MIN_CREDIT_USD = 0.25;

async function getJson(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${API}${path}`, { headers: headers(), signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`OpenRouter ${path} returned ${res.status}`);
  const json = (await res.json()) as { data?: Record<string, unknown> };
  return json.data ?? {};
}

/** Free checks before any paid work: the key is accepted and both the account and the key have credit left. */
export async function openRouterReady(): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    const [credits, key] = await Promise.all([getJson("/credits"), getJson("/key")]);
    const balance = Number(credits.total_credits) - Number(credits.total_usage);
    if (!(balance >= MIN_CREDIT_USD)) return { ok: false, reason: `OpenRouter credit left is $${balance.toFixed(2)}` };
    const keyRemaining = key.limit_remaining;
    if (typeof keyRemaining === "number" && keyRemaining < MIN_CREDIT_USD) {
      return { ok: false, reason: `the OpenRouter key's own limit has $${keyRemaining.toFixed(2)} left` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: `OpenRouter check failed: ${error instanceof Error ? error.message : String(error)}` };
  }
}

function costOf(json: Record<string, unknown>): number {
  const usage = json.usage as { cost?: number } | undefined;
  return typeof usage?.cost === "number" ? usage.cost : 0;
}

/** Generates one image. OpenAI image models only offer 3:2, so those are cropped to 16:9 later. */
export async function generateImage(prompt: string, deadline = Infinity): Promise<{ image: Buffer; costUsd: number }> {
  const isOpenAI = IMAGE_MODEL.startsWith("openai/");
  const json = await postJson("/images", {
    model: IMAGE_MODEL,
    prompt,
    aspect_ratio: isOpenAI ? "3:2" : "16:9",
    ...(isOpenAI ? { quality: IMAGE_QUALITY } : {}),
  }, deadline);
  const data = json.data as { b64_json?: string }[] | undefined;
  const b64 = data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenRouter returned no image");
  return { image: Buffer.from(b64, "base64"), costUsd: costOf(json) };
}

const CHECK_SCHEMA = {
  name: "image_check",
  strict: true,
  schema: {
    type: "object",
    properties: {
      people: { type: "boolean" },
      text: { type: "boolean" },
      plates: { type: "boolean" },
      gore: { type: "boolean" },
      photorealistic: { type: "boolean" },
      alt: { type: "string" },
    },
    required: ["people", "text", "plates", "gore", "photorealistic", "alt"],
    additionalProperties: false,
  },
};

const ALT_BANNED_START = /^(an?\s+)?(image|picture|photo|illustration|drawing)\s+(of|showing)\s+/i;

/** Tidies vision-model alt text: no "image of" opener, no digit runs, at most 124 characters. */
export function cleanAlt(raw: string): string {
  let alt = raw.replace(/\s+/g, " ").trim().replace(ALT_BANNED_START, "");
  alt = alt.replace(/\b\d{2,}\b/g, "").replace(/\s{2,}/g, " ").trim().replace(/[.\s]+$/, "");
  if (alt.length > 124) alt = alt.slice(0, 124).replace(/\s+\S*$/, "");
  return alt.charAt(0).toUpperCase() + alt.slice(1);
}

/** Asks a vision model yes/no questions about a generated image and for alt text describing it. */
export async function checkImage(webp: Buffer, deadline = Infinity): Promise<{ check: ImageCheck; alt: string; costUsd: number }> {
  let costUsd = 0;
  let parsed: (ImageCheck & { alt?: unknown }) | null = null;
  // A provider error can cut the JSON answer short, so ask once more before giving up on the image.
  for (let ask = 1; ask <= 2 && !parsed; ask++) {
    const json = await postJson("/chat/completions", {
      model: CHECK_MODEL,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Answer each question about this image strictly. Look closely at every vehicle window before answering. " +
                "people: is there any person, face, head, body or silhouette of a person anywhere, including a head, shoulders or " +
                "seated figure seen through a vehicle window? Answer true if any shape inside a vehicle could be read as a person's head. " +
                "text: any readable text, letters or numbers? plates: is there a license plate, or a blank rectangular plate-shaped " +
                "panel where a license plate would go, on any vehicle? gore: any blood, injury, body or gore? " +
                "photorealistic: does it look like a photograph rather than a flat illustration? " +
                "alt: describe what this illustration shows for a screen reader in one plain phrase under 120 characters, " +
                "for example \"A pickup truck and a sedan on a wet two-lane highway at dusk in flat teal tones\". " +
                "Do not start with \"image of\", \"picture of\" or \"illustration of\", and do not mention names, brands, numbers or plate text.",
            },
            { type: "image_url", image_url: { url: `data:image/webp;base64,${webp.toString("base64")}` } },
          ],
        },
      ],
      response_format: { type: "json_schema", json_schema: CHECK_SCHEMA },
    }, deadline).catch((error: unknown) => {
      throw new ImageCheckError(error instanceof Error ? error.message : String(error), costUsd);
    });
    costUsd += costOf(json);
    const choices = json.choices as { message?: { content?: string } }[] | undefined;
    try {
      parsed = JSON.parse(choices?.[0]?.message?.content ?? "") as ImageCheck & { alt?: unknown };
    } catch {
      parsed = null;
    }
  }
  if (!parsed) throw new ImageCheckError("Image check returned no valid answer", costUsd);
  const check: ImageCheck = { people: false, text: false, plates: false, gore: false, photorealistic: false };
  for (const key of ["people", "text", "plates", "gore", "photorealistic"] as const) {
    if (typeof parsed[key] !== "boolean") throw new ImageCheckError(`Image check answer is missing "${key}"`, costUsd);
    check[key] = parsed[key];
  }
  const alt = typeof parsed.alt === "string" ? cleanAlt(parsed.alt) : "";
  if (alt.length < 10) throw new ImageCheckError("Image check returned no usable alt text", costUsd);
  return { check, alt, costUsd };
}
