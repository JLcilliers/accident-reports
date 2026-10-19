import type { Prisma, PrismaClient } from "@prisma/client";

export interface ClaimedArticle {
  id: string;
  slug: string;
  headline: string;
  summary: string | null;
  city: string | null;
  state: string | null;
  occurredAt: Date;
  extractedFacts: Prisma.JsonValue;
  articleAttempts: number;
}

// Any fixed number works, as long as every run uses the same one (the image claim uses 7140021).
const CLAIM_LOCK = 7140022;

/**
 * Claims one incident created on or after `start` that has no article, fewer than `maxAttempts` attempts and
 * coverage from at least two different publishers, keeping the attempts made in the current UTC day within
 * `dailyLimit`.
 *
 * The attempt is counted before the model is called, so a crash mid-run still uses it up. An incident is tried
 * at most once per UTC day, which makes the count of incidents attempted today the count of attempts today.
 * Incidents with a single publisher are never claimed, so they cost nothing; one becomes eligible if a second
 * publisher's coverage is ingested later. The claim is a single UPDATE under an advisory lock, so overlapping
 * runs can neither pick the same incident nor go over the daily limit together.
 */
export async function claimArticle(
  db: PrismaClient,
  options: { start: Date; dailyLimit: number; maxAttempts: number }
): Promise<{ usedToday: number; claimed: ClaimedArticle | null }> {
  const { start, dailyLimit, maxAttempts } = options;
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);

  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${CLAIM_LOCK})`;
    const usedToday = await tx.incident.count({ where: { articleAttemptedAt: { gte: dayStart } } });
    if (usedToday >= dailyLimit) return { usedToday, claimed: null };

    const [claimed] = (await tx.$queryRaw`
      UPDATE "Incident"
         SET "articleAttempts" = COALESCE("articleAttempts", 0) + 1,
             "articleAttemptedAt" = (NOW() AT TIME ZONE 'UTC')
       WHERE id IN (
         SELECT i.id FROM "Incident" i
          WHERE i."articleBody" IS NULL
            AND COALESCE(i."articleAttempts", 0) < ${maxAttempts}
            AND (i."articleAttemptedAt" IS NULL OR i."articleAttemptedAt" < ${dayStart.toISOString()}::timestamp)
            AND i."createdAt" >= ${start.toISOString()}::timestamp
            AND (SELECT COUNT(DISTINCT lower(trim(s.publisher))) FROM "IncidentSource" s
                  WHERE s."incidentId" = i.id AND trim(s.publisher) <> '') >= 2
          ORDER BY i."createdAt" DESC
          LIMIT 1
          FOR UPDATE SKIP LOCKED
       )
      RETURNING id, slug, headline, summary, city, state, "occurredAt", "extractedFacts", "articleAttempts"`) as ClaimedArticle[];
    return { usedToday, claimed: claimed ?? null };
  });
}
