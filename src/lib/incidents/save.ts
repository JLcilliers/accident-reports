import prisma from "@/lib/prisma";
import { buildIncidentSlug } from "./slug";
import { isSameCrash, makeIncidentKey } from "./dedupe";
import type { IncidentCandidate } from "./types";

const MATCH_WINDOW_MS = 48 * 60 * 60 * 1000;

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
          publisherDomain: candidate.publisherDomain,
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

  const since = new Date(Date.now() - MATCH_WINDOW_MS);

  // A story already stored on any incident stays there, even once that incident is older than the window.
  const known = await prisma.incidentSource.findFirst({
    where: { url: candidate.link },
    select: { incident: { select: { id: true, slug: true } } },
  });
  if (known) {
    return { incidentId: known.incident.id, slug: known.incident.slug, isNew: false, sourceAdded: false };
  }

  // The same story from the same publisher, stored again under another date or place.
  if (candidate.publisher) {
    const repeat = await prisma.incidentSource.findFirst({
      where: { title: candidate.headline, publisher: candidate.publisher, incident: { createdAt: { gte: since } } },
      select: { incident: { select: { id: true, slug: true } } },
    });
    if (repeat) {
      return { incidentId: repeat.incident.id, slug: repeat.incident.slug, isNew: false, sourceAdded: false };
    }
  }

  // Another report of a crash already in the database: the same state, an incident from the last 48 hours,
  // and a headline that matches it. It becomes a source of that incident instead of a second incident.
  if (candidate.state) {
    const recent = await prisma.incident.findMany({
      where: { state: candidate.state, createdAt: { gte: since } },
      select: { id: true, slug: true, headline: true, city: true, sources: { select: { title: true, url: true } } },
      orderBy: { createdAt: "desc" },
    });
    const match = recent.find(
      (incident) =>
        (!candidate.city || !incident.city || incident.city === candidate.city) &&
        isSameCrash(candidate.headline, [incident.headline, ...incident.sources.map((s) => s.title)])
    );
    if (match) {
      if (match.sources.some((s) => s.url === candidate.link)) {
        return { incidentId: match.id, slug: match.slug, isNew: false, sourceAdded: false };
      }
      // ":matched" marks a source joined by headline, so a wrong match can be found and split off again.
      await prisma.incidentSource.create({
        data: {
          incidentId: match.id,
          sourceType: "google_news:matched",
          url: candidate.link,
          title: candidate.headline,
          publisher: candidate.publisher,
          publisherDomain: candidate.publisherDomain,
          snippet: candidate.snippet,
          publishedAt: candidate.occurredAt,
        },
      });
      console.log(`[Incident] "${candidate.headline}" matches ${match.slug}: added as a source`);
      return { incidentId: match.id, slug: match.slug, isNew: false, sourceAdded: true };
    }
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
          publisherDomain: candidate.publisherDomain,
          snippet: candidate.snippet,
          publishedAt: candidate.occurredAt,
        },
      },
    },
  });

  // SEO content generation is now handled by the dedicated /api/cron/generate-seo endpoint
  // This ensures the ingestion process completes quickly within Vercel's timeout limits
  // The generate-seo cron runs separately to backfill facts and articles for new incidents
  console.log(`[Incident] Created new incident: ${incident.slug} (SEO content will be generated by backfill cron)`);

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
