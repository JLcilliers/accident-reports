import sharp from "sharp";
import { put } from "@vercel/blob";
import { IMAGE_MODEL, checkImage, generateImage, type ImageCheck } from "@/lib/images/openrouter";

export const IMAGE_WIDTH = 1200;
export const IMAGE_HEIGHT = 675;
export const MAX_ATTEMPTS = 2;

const HOUSE_STYLE =
  "Flat editorial illustration in a minimal vector style for a traffic news website. " +
  "Palette: deep teal (#2A7D6E), light teal (#A7D3C9), soft grey and off-white, with one muted amber accent from vehicle lights. " +
  "Simple geometric shapes, flat colors, no gradients or texture, plain uncluttered background, wide landscape composition with the subject centered.";

const RULES =
  "Strictly no people, faces, drivers or silhouettes of people, no text, letters, numbers or signs with writing, no number plates, " +
  "no logos or brand badges, no recognisable car models, no real landmarks, no damage, debris, injuries, blood or emergency victims, " +
  "and nothing photorealistic.";

const STRICT =
  "Show the vehicles from a distance with dark, opaque windows so no one can be seen inside, and leave the roadside free of any signs.";

export function buildPrompt(scene: string, strict: boolean): string {
  return `${HOUSE_STYLE} Scene: ${scene}. ${strict ? `${STRICT} ` : ""}${RULES}`;
}

export interface AttemptLog {
  attempt: number;
  check: ImageCheck | null;
  costUsd: number;
  error?: string;
}

export interface IllustrationResult {
  status: "OK" | "FAILED";
  url: string | null;
  model: string;
  costUsd: number;
  attempts: AttemptLog[];
}

function failedChecks(check: ImageCheck): string[] {
  return (Object.keys(check) as (keyof ImageCheck)[]).filter((k) => check[k]);
}

/**
 * Generates an illustration for a scene, checks it with a vision model and uploads it to Vercel Blob.
 * At most MAX_ATTEMPTS generations; the second uses a stricter prompt. Any "yes" from the check discards the image.
 */
export async function createIllustration(key: string, scene: string): Promise<IllustrationResult> {
  const attempts: AttemptLog[] = [];
  let costUsd = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let attemptCost = 0;
    try {
      const generated = await generateImage(buildPrompt(scene, attempt > 1));
      attemptCost += generated.costUsd;
      const webp = await sharp(generated.image)
        .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "centre" })
        .webp({ quality: 80 })
        .toBuffer();
      const checked = await checkImage(webp);
      attemptCost += checked.costUsd;
      costUsd += attemptCost;
      attempts.push({ attempt, check: checked.check, costUsd: attemptCost });

      const problems = failedChecks(checked.check);
      if (problems.length > 0) {
        console.log(`[images] ${key} attempt ${attempt} rejected by check: ${problems.join(", ")}`);
        continue;
      }

      const blob = await put(`illustrations/${key}.webp`, webp, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: true,
        cacheControlMaxAge: 31536000,
      });
      console.log(`[images] ${key} attempt ${attempt} passed the check, cost $${costUsd.toFixed(6)}`);
      return { status: "OK", url: blob.url, model: IMAGE_MODEL, costUsd, attempts };
    } catch (error) {
      costUsd += attemptCost;
      const message = error instanceof Error ? error.message : String(error);
      attempts.push({ attempt, check: null, costUsd: attemptCost, error: message });
      console.error(`[images] ${key} attempt ${attempt} failed: ${message}`);
    }
  }

  return { status: "FAILED", url: null, model: IMAGE_MODEL, costUsd, attempts };
}
