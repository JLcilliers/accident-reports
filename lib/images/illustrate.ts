import sharp from "sharp";
import { putBefore } from "@/lib/images/blob";
import { lookFor, type Composition, type Framing, type Look } from "@/lib/images/compositions";
import { IMAGE_MODEL, ImageCheckError, checkImage, generateImage, type ImageCheck } from "@/lib/images/openrouter";
import { dHash, hashDistance } from "@/lib/images/phash";
import type { SceneCues, Time, Weather } from "@/lib/images/scene";

export const IMAGE_WIDTH = 1200;
export const IMAGE_HEIGHT = 675;
export const MAX_ATTEMPTS = 2;
// Comfortably more than one generation and its check (about 45 s at the slow end), so an attempt that
// starts is not cut off after it has been paid for. With less time left it is skipped.
const MIN_ATTEMPT_MS = 60_000;

const HOUSE_STYLE =
  "Flat editorial illustration in a minimal vector style for a traffic news website. " +
  "Base palette: deep teal (#2A7D6E), light teal (#A7D3C9), soft grey and off-white, with accent colours taken from the light and the weather. " +
  "Simple geometric shapes, flat colours, no gradients or texture, uncluttered, wide landscape format.";

const RULES =
  "Strictly no people, faces, drivers, riders or silhouettes of people, no text, letters, numbers or signs with writing, no number plates, " +
  "no logos or brand badges, no recognisable car models, no real landmarks, no damage, debris, injuries, blood or emergency victims, " +
  "and nothing photorealistic.";

const STRICT = "Keep any vehicles small and far away with fully dark, opaque windows, and leave the roadside free of any signs.";

const LIGHT: Record<Time, string> = {
  day: "a light sky with one muted amber accent",
  dawn: "soft peach dawn light",
  dusk: "warm orange and pink dusk light",
  night: "a deep blue night with warm amber lights",
};
const WEATHER_TONE: Record<Weather, string> = {
  clear: "",
  rain: "cool rain greys and soft reflections",
  snow: "pale blue and white snow",
  fog: "muted fog greys",
};
const WHEN: Record<Time, string> = { day: "in daylight", dawn: "at dawn", dusk: "at dusk", night: "at night" };
const SKY: Record<Weather, string> = { clear: "", rain: ", in the rain", snow: ", with snow on the ground", fog: ", in light fog" };
const GREENERY = {
  winter: "Any trees are bare for winter.",
  spring: "Any trees and grass are a fresh spring green.",
  summer: "Any trees and grass are a full summer green.",
  autumn: "Any trees are in autumn orange and gold.",
};

function vehicleNoun(cls: string): string {
  if (cls === "motorcycle") return "a parked motorcycle with no rider";
  if (cls === "bicycle") return "a bicycle with no rider";
  return `${/^[aeiou]/i.test(cls) ? "an" : "a"} ${cls}`;
}

function vehicleSentence(framing: Framing, classes: string[]): string {
  const list = classes.length > 0 ? classes : ["car", "car"];
  const names = list.length === 2 && list[0] === list[1] && !/motorcycle|bicycle/.test(list[0]) ? [`two ${list[0]}s`] : list.map(vehicleNoun);
  const all = names.join(" and ");
  const lead = all.charAt(0).toUpperCase() + all.slice(1);
  switch (framing) {
    case "none":
      return "There are no vehicles anywhere in the picture.";
    case "above":
      return `${lead} seen from directly above as simple shapes, showing only their roofs.`;
    case "distant":
      return `${lead}, small in the distance, with fully dark windows.`;
    case "rear":
      return `${names[0].charAt(0).toUpperCase() + names[0].slice(1)} seen from behind and slightly to one side, with fully dark, opaque windows and no license plate.`;
    case "lights":
      return "Vehicles appear only as glowing lights and simple dark shapes.";
  }
}

/** The full image prompt for one composition, with the article's vehicles and the chosen look. */
export function buildPrompt(composition: Composition, cues: SceneCues, look: Look, strict: boolean, place?: string): string {
  const accent = [LIGHT[look.time], WEATHER_TONE[look.weather]].filter(Boolean).join(", with ");
  const where = place ? `, among ${place}` : "";
  const greenery = look.weather === "snow" ? "" : `${GREENERY[look.season]} `;
  return (
    `${HOUSE_STYLE} Accent colours: ${accent}. ` +
    `Scene: ${composition.setting}${where}, ${WHEN[look.time]}${SKY[look.weather]}. ` +
    `${greenery}${vehicleSentence(composition.framing, cues.vehicles)} ${strict ? `${STRICT} ` : ""}${RULES}`
  );
}

/** What to draw: the article's cues, a seed for varied choices, and the compositions for the first and second attempts. */
export interface DrawPlan {
  cues: SceneCues;
  seed: number;
  compositions: [Composition, Composition];
  /** Scenery to set the picture in, used for the guide pages. */
  place?: string;
}

/** Hashes of recent images, and the distance at or under which a new image counts as too similar. */
export interface Similarity {
  hashes: string[];
  threshold: number;
}

export interface AttemptLog {
  attempt: number;
  composition: string;
  check: ImageCheck | null;
  costUsd: number;
  hash?: string;
  nearest?: number;
  error?: string;
  skipped?: boolean;
}

export interface IllustrationResult {
  status: "OK" | "FAILED";
  url: string | null;
  alt: string | null;
  model: string;
  composition: string | null;
  look: Look | null;
  prompt: string | null;
  hash: string | null;
  /** Distance to the most similar recent image, when there were any to compare with. */
  nearest: number | null;
  costUsd: number;
  attempts: AttemptLog[];
}

function failedChecks(check: ImageCheck): string[] {
  return (Object.keys(check) as (keyof ImageCheck)[]).filter((k) => check[k]);
}

/**
 * Generates an illustration, checks it with a vision model and uploads it to Vercel Blob. At most
 * MAX_ATTEMPTS generations: a second one uses the plan's second composition, with a stricter prompt when
 * the check rejected the first. Any "yes" from the check discards an image, and so does a hash at or
 * under the similarity threshold while a second attempt is still possible. Nothing runs past `deadline`
 * (epoch ms), so a caller can always store the outcome before its time limit.
 */
export async function createIllustration(
  key: string,
  plan: DrawPlan,
  deadline = Infinity,
  similarity?: Similarity
): Promise<IllustrationResult> {
  const attempts: AttemptLog[] = [];
  let costUsd = 0;
  let strict = false;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const composition = plan.compositions[attempt - 1] ?? plan.compositions[0];
    if (deadline - Date.now() < MIN_ATTEMPT_MS) {
      attempts.push({ attempt, composition: composition.name, check: null, costUsd: 0, skipped: true, error: "skipped: not enough time left in this run" });
      break;
    }
    const look = lookFor(composition, plan.cues, plan.seed);
    const prompt = buildPrompt(composition, plan.cues, look, strict, plan.place);
    let attemptCost = 0;
    let webp: Buffer;
    let checked: Awaited<ReturnType<typeof checkImage>>;
    let hash: string;
    try {
      const generated = await generateImage(prompt, deadline);
      attemptCost += generated.costUsd;
      webp = await sharp(generated.image)
        .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "centre" })
        .webp({ quality: 80 })
        .toBuffer();
      checked = await checkImage(webp, deadline);
      attemptCost += checked.costUsd;
      hash = await dHash(webp);
    } catch (error) {
      if (error instanceof ImageCheckError) attemptCost += error.costUsd;
      costUsd += attemptCost;
      const message = error instanceof Error ? error.message : String(error);
      attempts.push({ attempt, composition: composition.name, check: null, costUsd: attemptCost, error: message });
      console.error(`[images] ${key} attempt ${attempt} failed: ${message}`);
      continue;
    }

    costUsd += attemptCost;
    const nearest = similarity && similarity.hashes.length > 0 ? Math.min(...similarity.hashes.map((h) => hashDistance(h, hash))) : null;
    const log: AttemptLog = { attempt, composition: composition.name, check: checked.check, costUsd: attemptCost, hash, ...(nearest !== null ? { nearest } : {}) };
    attempts.push(log);
    const problems = failedChecks(checked.check);
    if (problems.length > 0) {
      log.error = `rejected by the check: ${problems.join(", ")}`;
      console.log(`[images] ${key} attempt ${attempt} ${log.error}`);
      strict = true;
      continue;
    }
    if (similarity && nearest !== null && nearest <= similarity.threshold && attempt < MAX_ATTEMPTS) {
      log.error = `too similar to a recent image (distance ${nearest})`;
      console.log(`[images] ${key} attempt ${attempt} ${log.error}`);
      continue;
    }

    try {
      const blob = await putBefore(deadline, `illustrations/${key}.webp`, webp, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: true,
        cacheControlMaxAge: 31536000,
      });
      console.log(`[images] ${key} attempt ${attempt} (${composition.name}) passed, cost $${costUsd.toFixed(6)}`);
      return { status: "OK", url: blob.url, alt: checked.alt, model: IMAGE_MODEL, composition: composition.name, look, prompt, hash, nearest, costUsd, attempts };
    } catch (error) {
      // The image passed; only storing it failed, so paying for another generation would not help.
      log.error = `upload failed: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`[images] ${key} attempt ${attempt} ${log.error}`);
      break;
    }
  }

  return { status: "FAILED", url: null, alt: null, model: IMAGE_MODEL, composition: null, look: null, prompt: null, hash: null, nearest: null, costUsd, attempts };
}
