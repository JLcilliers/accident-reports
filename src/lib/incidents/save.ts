import prisma from "@/lib/prisma";
import { buildIncidentSlug } from "./slug";
import { makeIncidentKey } from "./dedupe";
import type { IncidentCandidate } from "./types";

/**
 * Result of an upsert operation.
 */
export interface UpsertResult {
  incidentId: string;
  slug: string;
  isNew: boolean;
  sourceAdded: boolean;
}

/**
 * Upserts an incident from a candidate.
 *
 * If an incident with the same dedupe key exists:
 * - Just adds a new source if this URL is new
 * - Returns the existing incident
 *
 * If no incident exists:
 * - Creates a new incident with the candidate data
 * - Creates an associated source
 *
 * @param candidate - The incident candidate to upsert
 * @returns Information about the upsert operation
 */
export async function upsertIncidentFromCandidate(
  candidate: IncidentCandidate
): Promise<UpsertResult> {
  const dedupeKey = makeIncidentKey(candidate);

  // Check if this incident already exists
  const existing = await prisma.incident.findUnique({
    where: { dedupeKey },
    include: { sources: true },
  });

  if (existing) {
    // Check if we already have this source URL
    const alreadyHasSource = existing.sources.some(
      (s) => s.url === candidate.link
    );

    if (!alreadyHasSource) {
      // Add new source to existing incident
      await prisma.incidentSource.create({
        data: {
          incidentId: existing.id,
          sourceType: "google_news",
          url: candidate.link,
          title: candidate.headline,
          publisher: candidate.publisher,
          snippet: candidate.snippet,
          publishedAt: candidate.occurredAt,
        },
      });

      return {
        incidentId: existing.id,
        slug: existing.slug,
        isNew: false,
        sourceAdded: true,
      };
    }

    return {
      incidentId: existing.id,
      slug: existing.slug,
      isNew: false,
      sourceAdded: false,
    };
  }

  // Create new incident
  let slug = buildIncidentSlug(candidate);

  // Ensure slug is unique
  const existingSlug = await prisma.incident.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingSlug) {
    // Append a random suffix to make it unique
    const suffix = Math.random().toString(36).slice(2, 6);
    slug = `${slug}-${suffix}`;
  }

  const incident = await prisma.incident.create({
    data: {
      slug,
      headline: candidate.headline,
      summary: candidate.snippet,
      city: candidate.city,
      state: candidate.state,
      country: candidate.country ?? "US",
      occurredAt: candidate.occurredAt,
      dedupeKey,
      sources: {
        create: {
          sourceType: "google_news",
          url: candidate.link,
          title: candidate.headline,
          publisher: candidate.publisher,
          snippet: candidate.snippet,
          publishedAt: candidate.occurredAt,
        },
      },
    },
  });

  return {
    incidentId: incident.id,
    slug: incident.slug,
    isNew: true,
    sourceAdded: true,
  };
}

/**
 * Batch upserts multiple incident candidates.
 *
 * @param candidates - Array of incident candidates to upsert
 * @returns Summary of the batch operation
 */
export async function batchUpsertIncidents(
  candidates: IncidentCandidate[]
): Promise<{
  newIncidents: number;
  updatedIncidents: number;
  skipped: number;
  errors: string[];
}> {
  let newIncidents = 0;
  let updatedIncidents = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const candidate of candidates) {
    try {
      const result = await upsertIncidentFromCandidate(candidate);

      if (result.isNew) {
        newIncidents++;
      } else if (result.sourceAdded) {
        updatedIncidents++;
      } else {
        skipped++;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      errors.push(`Failed to save "${candidate.headline}": ${message}`);
    }
  }

  return { newIncidents, updatedIncidents, skipped, errors };
}
