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
  /** Independent publishers covering it; with fewer than two, the article needs the publisher's own text. */
  publishers: number;
}

// Any fixed number works, as long as every run uses the same one (the image claim uses 7140021).
const CLAIM_LOCK = 7140022;

/**
 * Claims one incident created on or after `start` that has no article and fewer than `maxAttempts` attempts (one
 * found not to be a road crash has all of them used up), keeping the attempts made in the current UTC day
 * within `dailyLimit`. It must have coverage from at least two independent publishers, or from one whose site
 * is known and has not yet been searched for the story's text (see releaseForSecondPublisher).
 *
 * Syndicated copies count as one publisher: sources carrying the same headline (ignoring case and punctuation)
 * are one story however many stations ran it. Google News snippets only repeat the headline and the publisher's
 * name, so comparing headlines covers them too.
 *
 * The attempt is counted before the model is called, so a crash mid-run still uses it up. An incident is tried
 * at most once per UTC day, which makes the count of incidents attempted today the count of attempts today.
 * Incidents that qualify neither way are never claimed, so they cost nothing; one becomes eligible if
 * independent coverage is ingested later. The claim is a single UPDATE under an advisory lock, so overlapping
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
      WITH pick AS (
        SELECT i.id, p.publishers
          FROM "Incident" i
         CROSS JOIN LATERAL (
           SELECT LEAST(COUNT(DISTINCT lower(trim(s.publisher))),
                        COUNT(DISTINCT regexp_replace(lower(s.title), '[^a-z0-9]+', '', 'g')))::int AS publishers,
                  COALESCE(bool_or(s."publisherDomain" IS NOT NULL), false) AS "knownSite"
             FROM "IncidentSource" s
            WHERE s."incidentId" = i.id AND trim(s.publisher) <> ''
         ) p
         WHERE i."articleBody" IS NULL
           AND COALESCE(i."articleAttempts", 0) < ${maxAttempts}
           AND (i."articleAttemptedAt" IS NULL OR i."articleAttemptedAt" < ${dayStart.toISOString()}::timestamp)
           AND i."createdAt" >= ${start.toISOString()}::timestamp
           AND (p.publishers >= 2 OR (p.publishers = 1 AND p."knownSite" AND i."articleTextTriedAt" IS NULL))
         ORDER BY i."createdAt" DESC
         LIMIT 1
         FOR UPDATE OF i SKIP LOCKED
      )
      UPDATE "Incident" u
         SET "articleAttempts" = COALESCE(u."articleAttempts", 0) + 1,
             "articleAttemptedAt" = (NOW() AT TIME ZONE 'UTC')
        FROM pick
       WHERE u.id = pick.id
      RETURNING u.id, u.slug, u.headline, u.summary, u.city, u.state, u."occurredAt", u."extractedFacts",
                u."articleAttempts", pick.publishers`) as ClaimedArticle[];
    return { usedToday, claimed: claimed ?? null };
  });
}

/**
 * For an incident claimed on one publisher's coverage whose text could not be fetched from that publisher's
 * site: gives the attempt back (it reached no model) and stops the site being searched again, so the incident
 * waits for a second publisher like any other. Raw SQL leaves updatedAt alone, as nothing visible changed.
 */
export async function releaseForSecondPublisher(db: PrismaClient, id: string): Promise<void> {
  await db.$executeRaw`
    UPDATE "Incident"
       SET "articleAttempts" = "articleAttempts" - 1,
           "articleAttemptedAt" = NULL,
           "articleTextTriedAt" = (NOW() AT TIME ZONE 'UTC')
     WHERE id = ${id}`;
}
