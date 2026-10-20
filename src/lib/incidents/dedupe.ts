import crypto from "crypto";
import type { IncidentCandidate } from "./types";
import { US_STATES } from "./fromGoogleNews";

/**
 * Creates a unique deduplication key for an incident candidate.
 *
 * The key is based on:
 * - Normalized headline (lowercase, no punctuation)
 * - Date (YYYY-MM-DD)
 * - Location (city-state)
 *
 * This allows us to identify the same accident reported by multiple sources.
 *
 * @param candidate - The incident candidate to create a key for
 * @returns A SHA-1 hash string that uniquely identifies this incident
 */
export function makeIncidentKey(candidate: IncidentCandidate): string {
  // Normalize the headline: lowercase, remove punctuation, collapse whitespace
  const normTitle = candidate.headline
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Extract just the date part (YYYY-MM-DD)
  const datePart = candidate.occurredAt.toISOString().slice(0, 10);

  // Build location string
  const loc = `${candidate.city ?? ""}-${candidate.state ?? ""}`.toLowerCase();

  // Create a hash of all components
  const input = `${normTitle}|${datePart}|${loc}`;
  return crypto.createHash("sha1").update(input).digest("hex");
}

/**
 * Deduplicates incident candidates by their dedupe key.
 * When duplicates are found, keeps the one with the most information.
 *
 * @param candidates - Array of incident candidates to deduplicate
 * @returns Array of unique incident candidates
 */
export function deduplicateCandidates(
  candidates: IncidentCandidate[]
): IncidentCandidate[] {
  const seen = new Map<string, IncidentCandidate>();

  for (const candidate of candidates) {
    const key = makeIncidentKey(candidate);
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, candidate);
    } else {
      // Keep the candidate with more information
      // Prefer one with city, then one with snippet, then longer headline
      const existingScore = scoreCandidate(existing);
      const newScore = scoreCandidate(candidate);

      if (newScore > existingScore) {
        seen.set(key, candidate);
      }
    }
  }

  return Array.from(seen.values());
}

const STOP_WORDS = new Set(
  "the and for with from after into near that this was were has have are its his her their who what when man woman says said police news video update".split(" ")
);
// Words in almost every crash headline, and state names (matches are within one state). Sharing only these
// says nothing about whether two crashes are the same.
const CRASH_WORDS = new Set([
  ...Object.keys(US_STATES).flatMap((name) => name.split(" ")),
  ...("crash crashes crashed accident collision wreck hit run fatal fatally killed kills killing dies died dead deadly " +
    "death injured injures injuring injury injuries hurt critically seriously hospitalized hospital wrong way vehicle " +
    "vehicles multi multiple car cars truck semi suv bus motorcycle motorcyclist bicycle bicyclist cyclist scooter " +
    "pedestrian pedestrians driver drivers person people struck charged arrested arrest suspect sought seek search " +
    "searching sentenced murder manslaughter dui investigating investigate investigation identified identify involving " +
    "involved county city state highway freeway interstate road street avenue ave drive boulevard lane lanes route " +
    "closes closed closure shuts down reopens north south east west northbound southbound eastbound westbound side one " +
    "two three year years old teen student family officers officer sheriffs deputies troopers trooper new while over " +
    "before leaves taken help say report live watch patrol chp fhp dps thp").split(" "),
]);
const DIRECTION = /\b(?:(north|south|east|west)bound|([nsew])b)\b/g;
const ROAD_NUMBER =
  /\b(?:i|interstate|us|hwy|highway|route|rte|rt|sr|loop|fm)[\s.-]*(\d{1,4}[a-z]?)\b|\b(\d{1,4})[\s-]*(?:fwy|freeway)\b/g;
const AGE = /\b(\d{1,3})[\s-]*years?[\s-]*old\b|,\s*(\d{1,3}),/g;

/** A headline's words of 3 letters or more, without the most common ones. */
function headlineWords(title: string): Set<string> {
  return new Set(
    title.toLowerCase().replace(/['’]/g, "").split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
  );
}

/** Both name something (a direction, a road number) and nothing they name is the same. */
const differ = (a: string[], b: string[]) => a.length > 0 && b.length > 0 && !a.some((x) => b.includes(x));
const directions = (title: string) => [...title.toLowerCase().matchAll(DIRECTION)].map((m) => (m[1] ?? m[2])[0]);
const roads = (title: string) => [...title.toLowerCase().matchAll(ROAD_NUMBER)].map((m) => m[1] ?? m[2]);
const ages = (title: string) => [...title.toLowerCase().matchAll(AGE)].map((m) => m[1] ?? m[2]);
const sexes = (title: string) => [...title.toLowerCase().matchAll(/\b(?:wo)?man\b/g)].map((m) => m[0]);

/**
 * Whether a new headline tells the same crash as one of an existing incident's titles (its headline and its
 * sources'). One title must share at least 3 words with it, making up at least 60% of the shorter headline,
 * including a place, road or name and not just crash words; with only one such word, 75%. No title may point
 * the other way, name another road ("northbound" against "SB", I-35 against I-20), give another age ("man, 23"
 * against "16-year-old") or speak of a man where the other speaks of a woman.
 */
export function isSameCrash(headline: string, titles: string[]): boolean {
  const words = headlineWords(headline);
  const similar = (title: string) => {
    const other = headlineWords(title);
    const shared = [...words].filter((w) => other.has(w));
    const overlap = shared.length / Math.min(words.size, other.size);
    const telling = shared.filter((w) => !CRASH_WORDS.has(w)).length;
    return shared.length >= 3 && telling >= 1 && overlap >= (telling >= 2 ? 0.6 : 0.75);
  };
  const conflicting = (title: string) =>
    differ(directions(headline), directions(title)) ||
    differ(roads(headline), roads(title)) ||
    differ(ages(headline), ages(title)) ||
    differ(sexes(headline), sexes(title));
  return titles.some(similar) && !titles.some(conflicting);
}

/**
 * Scores a candidate based on completeness of information.
 * Higher score = more complete.
 */
function scoreCandidate(candidate: IncidentCandidate): number {
  let score = 0;
  if (candidate.city) score += 3;
  if (candidate.state) score += 2;
  if (candidate.snippet) score += 1;
  if (candidate.headline.length > 50) score += 1;
  if (candidate.publisher) score += 1;
  return score;
}
