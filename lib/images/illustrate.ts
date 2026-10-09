import sharp from "sharp";
import { putBefore } from "@/lib/images/blob";
import { IMAGE_MODEL, ImageCheckError, checkImage, generateImage, type ImageCheck } from "@/lib/images/openrouter";

export const IMAGE_WIDTH = 1200;
export const IMAGE_HEIGHT = 675;
export const MAX_ATTEMPTS = 2;
// Comfortably more than one generation and its check (about 45 s at the slow end), so an attempt that
// starts is not cut off after it has been paid for. With less time left it is skipped.
const MIN_ATTEMPT_MS = 60_000;

const HOUSE_STYLE =
  "Flat editorial illustration in a minimal vector style for a traffic news website. " +
  "Palette: deep teal (#2A7D6E), light teal (#A7D3C9), soft grey and off-white, with one muted amber accent from vehicle lights. " +
  "Simple geometric shapes, flat colors, no gradients or texture, plain uncluttered background, wide landscape composition with the subject centered.";

const RULES =
  "Strictly no people, faces, drivers or silhouettes of people, no text, letters, numbers or signs with writing, no number plates, " +
  "no logos or brand badges, no recognisable car models, no real landmarks, no damage, debris, injuries, blood or emergency victims, " +
  "and nothing photorealistic.";

const VIEW = "Show every vehicle in side profile with dark, opaque windows so no one can be seen inside.";

const STRICT = "Keep the vehicles small and far away, and leave the roadside free of any signs.";

export function buildPrompt(scene: string, strict: boolean): string {
  return `${HOUSE_STYLE} Scene: ${scene}. ${VIEW} ${strict ? `${STRICT} ` : ""}${RULES}`;
}

export interface AttemptLog {
  attempt: number;
  check: ImageCheck | null;
  costUsd: number;
  error?: string;
  skipped?: boolean;
}

export interface IllustrationResult {
  status: "OK" | "FAILED";
  url: string | null;
  alt: string | null;
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
 * Nothing runs past `deadline` (epoch ms), so a caller can always store the outcome before its time limit.
 */
export async function createIllustration(key: string, scene: string, deadline = Infinity): Promise<IllustrationResult> {
  const attempts: AttemptLog[] = [];
  let costUsd = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (deadline - Date.now() < MIN_ATTEMPT_MS) {
      attempts.push({ attempt, check: null, costUsd: 0, skipped: true, error: "skipped: not enough time left in this run" });
      break;
    }
    let attemptCost = 0;
    let webp: Buffer;
    let checked: Awaited<ReturnType<typeof checkImage>>;
    try {
      const generated = await generateImage(buildPrompt(scene, attempt > 1), deadline);
      attemptCost += generated.costUsd;
      webp = await sharp(generated.image)
        .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "centre" })
        .webp({ quality: 80 })
        .toBuffer();
      checked = await checkImage(webp, deadline);
      attemptCost += checked.costUsd;
    } catch (error) {
      if (error instanceof ImageCheckError) attemptCost += error.costUsd;
      costUsd += attemptCost;
      const message = error instanceof Error ? error.message : String(error);
      attempts.push({ attempt, check: null, costUsd: attemptCost, error: message });
      console.error(`[images] ${key} attempt ${attempt} failed: ${message}`);
      continue;
    }

    costUsd += attemptCost;
    const log: AttemptLog = { attempt, check: checked.check, costUsd: attemptCost };
    attempts.push(log);
    const problems = failedChecks(checked.check);
    if (problems.length > 0) {
      console.log(`[images] ${key} attempt ${attempt} rejected by check: ${problems.join(", ")}`);
      continue;
    }

    try {
      const blob = await putBefore(deadline, `illustrations/${key}.webp`, webp, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: true,
        cacheControlMaxAge: 31536000,
      });
      console.log(`[images] ${key} attempt ${attempt} passed the check, cost $${costUsd.toFixed(6)}`);
      return { status: "OK", url: blob.url, alt: checked.alt, model: IMAGE_MODEL, costUsd, attempts };
    } catch (error) {
      // The image passed; only storing it failed, so paying for another generation would not help.
      log.error = `upload failed: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`[images] ${key} attempt ${attempt} ${log.error}`);
      break;
    }
  }

  return { status: "FAILED", url: null, alt: null, model: IMAGE_MODEL, costUsd, attempts };
}
