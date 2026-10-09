const API = "https://openrouter.ai/api/v1";

export const IMAGE_MODEL = process.env.IMAGE_MODEL || "openai/gpt-5-image-mini";
export const IMAGE_QUALITY = process.env.IMAGE_QUALITY || "low";
export const CHECK_MODEL = process.env.IMAGE_CHECK_MODEL || "google/gemini-2.5-flash-lite";

export interface ImageCheck {
  people: boolean;
  text: boolean;
  plates: boolean;
  gore: boolean;
  photorealistic: boolean;
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

async function postJson(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
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

function costOf(json: Record<string, unknown>): number {
  const usage = json.usage as { cost?: number } | undefined;
  return typeof usage?.cost === "number" ? usage.cost : 0;
}

/** Generates one image. OpenAI image models only offer 3:2, so those are cropped to 16:9 later. */
export async function generateImage(prompt: string): Promise<{ image: Buffer; costUsd: number }> {
  const isOpenAI = IMAGE_MODEL.startsWith("openai/");
  const json = await postJson("/images", {
    model: IMAGE_MODEL,
    prompt,
    aspect_ratio: isOpenAI ? "3:2" : "16:9",
    ...(isOpenAI ? { quality: IMAGE_QUALITY } : {}),
  });
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

/** Asks a small vision model yes/no questions about a generated image and for alt text describing it. */
export async function checkImage(webp: Buffer): Promise<{ check: ImageCheck; alt: string; costUsd: number }> {
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
              "Answer each question about this image strictly. people: does it show any person, face, body or silhouette of a person, " +
              "including inside a vehicle? text: any readable text, letters or numbers? plates: any vehicle number plate? " +
              "gore: any blood, injury, body or gore? photorealistic: does it look like a photograph rather than a flat illustration? " +
              "alt: describe what this illustration shows for a screen reader in one plain phrase under 120 characters, " +
              "for example \"A pickup truck and a sedan on a wet two-lane highway at dusk in flat teal tones\". " +
              "Do not start with \"image of\", \"picture of\" or \"illustration of\", and do not mention names, brands, numbers or plate text.",
          },
          { type: "image_url", image_url: { url: `data:image/webp;base64,${webp.toString("base64")}` } },
        ],
      },
    ],
    response_format: { type: "json_schema", json_schema: CHECK_SCHEMA },
  });
  const choices = json.choices as { message?: { content?: string } }[] | undefined;
  const content = choices?.[0]?.message?.content;
  if (!content) throw new Error("Image check returned no answer");
  const parsed = JSON.parse(content) as ImageCheck & { alt?: unknown };
  const check: ImageCheck = { people: false, text: false, plates: false, gore: false, photorealistic: false };
  for (const key of ["people", "text", "plates", "gore", "photorealistic"] as const) {
    if (typeof parsed[key] !== "boolean") throw new Error(`Image check answer is missing "${key}"`);
    check[key] = parsed[key];
  }
  const alt = typeof parsed.alt === "string" ? cleanAlt(parsed.alt) : "";
  if (alt.length < 10) throw new Error("Image check returned no usable alt text");
  return { check, alt, costUsd: costOf(json) };
}
