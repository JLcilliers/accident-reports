import type { Prisma, PrismaClient } from "@prisma/client";

export interface ClaimedIncident {
  id: string;
  slug: string;
  headline: string;
  articleBody: string | null;
  extractedFacts: Prisma.JsonValue;
}

export interface SavedIllustration {
  status: "OK" | "FAILED";
  url: string | null;
  alt: string | null;
  model: string;
  costUsd: number;
  attempts: number;
}

// Any fixed number works, as long as every run uses the same one.
const CLAIM_LOCK = 7140021;

/**
 * Claims up to `maxPerRun` incidents that have an article and no image yet and were created on or after
 * `start`, keeping the total for the current UTC day within `dailyLimit`.
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
          WHERE "articleBody" IS NOT NULL
            AND "imageStatus" = 'NONE'
            AND "imageAttempts" < ${maxAttempts}
            AND "createdAt" >= ${start.toISOString()}::timestamp
          ORDER BY "createdAt" ASC
          LIMIT ${take}
          FOR UPDATE SKIP LOCKED
       )
      RETURNING id, slug, headline, "articleBody", "extractedFacts"`) as ClaimedIncident[];
    return { usedToday, claimed };
  });
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
           "imageGeneratedAt" = (NOW() AT TIME ZONE 'UTC')
     WHERE id = ${id}`;
}
