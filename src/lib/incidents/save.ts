import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { buildIncidentSlug } from "./slug";
import { makeIncidentKey } from "./dedupe";
import { extractAccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { generateIncidentArticle } from "@/lib/seo/generateIncidentArticle";
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

  // Generate SEO content for new incidents (async, non-blocking)
  // Two-step process: 1) Extract facts, 2) Generate article using facts
  (async () => {
    try {
      // Build combined text from the candidate for fact extraction
      const combinedText = `${candidate.headline}. ${candidate.snippet || ""}`;

      // Step 1: Extract structured facts from the news coverage
      console.log(`[FactExtraction] Extracting facts for: ${incident.slug}`);
      const facts = await extractAccidentFacts(candidate.headline, combinedText);

      // Step 2: Generate SEO article using the extracted facts
      console.log(`[SEO] Generating article for: ${incident.slug}`);
      const seoContent = await generateIncidentArticle(
        {
          headline: candidate.headline,
          summary: candidate.snippet,
          city: candidate.city,
          state: candidate.state,
          occurredAt: candidate.occurredAt,
          sources: [{ title: candidate.headline, snippet: candidate.snippet }],
        },
        facts // Pass extracted facts to enrich the article
      );

      // Update incident with both facts and SEO content
      if (facts || seoContent) {
        await prisma.incident.update({
          where: { id: incident.id },
          data: {
            ...(facts && { extractedFacts: facts as unknown as Prisma.InputJsonValue }),
            ...(seoContent && {
              seoTitle: seoContent.seoTitle,
              seoDescription: seoContent.seoDescription,
              articleBody: seoContent.articleBody,
            }),
          },
        });
        console.log(`[SEO] Generated content for incident: ${incident.slug}`);
      }
    } catch (err) {
      console.error(`[SEO] Failed to generate content for ${incident.slug}:`, err);
    }
  })();

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
