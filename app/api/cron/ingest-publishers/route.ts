import { NextRequest, NextResponse } from "next/server";
import { PUBLISHER_FEEDS } from "@/src/config/publisherFeeds";
import { fetchPublisherFeed } from "@/src/lib/publisherFeeds";
import {
  toIncidentCandidates,
  deduplicateCandidates,
  batchUpsertIncidents,
} from "@/src/lib/incidents";

export const runtime = "nodejs";
export const maxDuration = 120;

const CONCURRENCY = 8;
// Feeds still being read after this are dropped for this run, leaving time to save what was found.
const FETCH_BUDGET_MS = 60_000;

/**
 * Cron job endpoint for ingesting accident news straight from publishers, next to Google News.
 *
 * This endpoint:
 * 1. Reads each publisher's news sitemap or RSS feed (see PUBLISHER_FEEDS), following its robots.txt
 * 2. Filters and normalizes the last day's items to incident candidates, the same way as Google News items
 * 3. De-duplicates candidates
 * 4. Upserts incidents to the database, with the source type "publisher_feed"
 *
 * Protected by CRON_SECRET for Vercel Cron Jobs authentication.
 *
 * @route GET /api/cron/ingest-publishers
 */
export async function GET(req: NextRequest) {
  // Authenticate the request
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // In production, require the CRON_SECRET
  if (process.env.NODE_ENV === "production") {
    if (!cronSecret) {
      console.error("CRON_SECRET is not configured");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startTime = Date.now();
  const budget = AbortSignal.timeout(FETCH_BUDGET_MS);
  const feedErrors: string[] = [];
  const allCandidates: ReturnType<typeof toIncidentCandidates> = [];
  let itemsFetched = 0;

  console.log(`[ingest-publishers] Starting ingestion with ${PUBLISHER_FEEDS.length} feeds`);

  const queue = [...PUBLISHER_FEEDS];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let feed = queue.shift(); feed; feed = queue.shift()) {
        try {
          const items = await fetchPublisherFeed(feed, budget);
          const candidates = toIncidentCandidates(items, feed.state ?? undefined);
          itemsFetched += items.length;
          allCandidates.push(...candidates.map((candidate) => ({ ...candidate, sourceType: "publisher_feed" as const })));
          if (candidates.length) console.log(`[ingest-publishers] ${feed.host}: ${items.length} items -> ${candidates.length} candidates`);
        } catch (error) {
          const errorMsg = `${feed.host}: ${error instanceof Error ? error.message : String(error)}`;
          feedErrors.push(errorMsg);
          console.error(`[ingest-publishers] ${errorMsg}`);
        }
      }
    })
  );

  // De-duplicate candidates
  const uniqueCandidates = deduplicateCandidates(allCandidates);
  console.log(`[ingest-publishers] ${allCandidates.length} candidates, ${uniqueCandidates.length} after dedup`);

  // Upsert to database
  const upsertResult = await batchUpsertIncidents(uniqueCandidates);

  const response = {
    ok: true,
    duration: `${Date.now() - startTime}ms`,
    feedsRead: PUBLISHER_FEEDS.length - feedErrors.length,
    itemsFetched,
    candidates: allCandidates.length,
    uniqueCandidates: uniqueCandidates.length,
    newIncidents: upsertResult.newIncidents,
    updatedIncidents: upsertResult.updatedIncidents,
    skipped: upsertResult.skipped,
    feedErrors: feedErrors.length,
    saveErrors: upsertResult.errors.length,
    errors: [...feedErrors, ...upsertResult.errors],
  };

  console.log(`[ingest-publishers] Completed:`, {
    ...response,
    errors: `${response.errors.length} error(s)`,
  });

  return NextResponse.json(response);
}
