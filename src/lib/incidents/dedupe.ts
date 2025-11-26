import crypto from "crypto";
import type { IncidentCandidate } from "./types";

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
