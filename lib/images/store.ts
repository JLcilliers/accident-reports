import type { Prisma, PrismaClient } from "@prisma/client";

export interface ClaimedIncident {
  id: string;
  slug: string;
  headline: string;
  summary: string | null;
  articleBody: string | null;
  extractedFacts: Prisma.JsonValue;
  occurredAt: Date;
}

export interface SavedIllustration {
  status: "OK" | "FAILED";
  url: string | null;
  alt: string | null;
  model: string;
  costUsd: number;
  attempts: number;
  composition: string | null;
  hash: string | null;
}

// Any fixed number works, as long as every run uses the same one.
const CLAIM_LOCK = 7140021;

/**
 * Claims up to `maxPerRun` incidents that have no image yet and were created on or after `start`, with or
 * without an article, keeping the total for the current UTC day within `dailyLimit`.
 *
 * Every attempt is reserved up front, so a crash mid-run never leads to an automatic retry. The claim is a
 * single UPDATE under an advisory lock, so overlapping runs can neither pick the same incident nor go over
 * the daily limit together. Raw SQL leaves updatedAt alone: drawing a picture is not an edit to the article.
 */
export async function claimIncidents(
  db: PrismaClient,
  options: { start: Date; dailyLimit: number; maxPerRun: number; maxAttempts: number }
): Promise<{ usedToday: number; claimed: ClaimedIncident[] }> {
  const { start, dailyLimit, maxPerRun, maxAttempts } = options;
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);

  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${CLAIM_LOCK})`;
    const usedToday = await tx.incident.count({ where: { imageGeneratedAt: { gte: dayStart } } });
    const take = Math.min(maxPerRun, Math.max(0, dailyLimit - usedToday));
    if (take === 0) return { usedToday, claimed: [] };

    const claimed = (await tx.$queryRaw`
      UPDATE "Incident"
         SET "imageAttempts" = ${maxAttempts}, "imageGeneratedAt" = (NOW() AT TIME ZONE 'UTC')
       WHERE id IN (
         SELECT id FROM "Incident"
          WHERE "imageStatus" = 'NONE'
            AND "imageAttempts" < ${maxAttempts}
            AND "createdAt" >= ${start.toISOString()}::timestamp
          ORDER BY "createdAt" ASC
          LIMIT ${take}
          FOR UPDATE SKIP LOCKED
       )
      RETURNING id, slug, headline, summary, "articleBody", "extractedFacts", "occurredAt"`) as ClaimedIncident[];
    return { usedToday, claimed };
  });
}

/** Marks the imageModel of incidents whose coverage is not about a road crash, so they can be found later. */
export const NOT_A_CRASH_MARK = "not a road crash";

/**
 * Records that an incident's coverage is not about a road crash: it gets no image and, being FAILED with
 * every attempt used, is never claimed again. imageGeneratedAt is cleared, so it does not count towards the
 * daily limit.
 */
export async function markNotACrash(db: PrismaClient, id: string): Promise<void> {
  await db.$executeRaw`
    UPDATE "Incident"
       SET "imageStatus" = 'FAILED'::"ImageStatus",
           "imageUrl" = NULL,
           "imageAlt" = NULL,
           "imageModel" = ${NOT_A_CRASH_MARK},
           "imageCostUsd" = 0,
           "imageGeneratedAt" = NULL
     WHERE id = ${id}`;
}

/** Stores a generation outcome, leaving updatedAt alone for the same reason as the claim. */
export async function saveIllustration(db: PrismaClient, id: string, result: SavedIllustration): Promise<void> {
  await db.$executeRaw`
    UPDATE "Incident"
       SET "imageStatus" = ${result.status}::"ImageStatus",
           "imageUrl" = ${result.url},
           "imageAlt" = ${result.alt},
           "imageModel" = ${result.model},
           "imageCostUsd" = ${result.costUsd},
           "imageAttempts" = ${result.attempts},
           "imageComposition" = ${result.composition},
           "imageHash" = ${result.hash},
           "imageGeneratedAt" = (NOW() AT TIME ZONE 'UTC')
     WHERE id = ${id}`;
}

/** The most recent stored illustrations, newest first: their compositions and hashes keep new pictures different. */
export async function recentImages(db: PrismaClient, take = 50) {
  return db.incident.findMany({
    where: { imageStatus: "OK" },
    orderBy: { imageGeneratedAt: "desc" },
    take,
    select: { imageComposition: true, imageHash: true, imageUrl: true },
  });
}
