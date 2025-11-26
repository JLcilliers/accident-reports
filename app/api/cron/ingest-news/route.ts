import { NextRequest, NextResponse } from "next/server";
import {
  GOOGLE_NEWS_QUERIES,
  buildGoogleNewsRssUrl,
} from "@/src/config/newsQueries";
import { fetchGoogleNewsFeed } from "@/src/lib/googleNews";
import {
  toIncidentCandidates,
  deduplicateCandidates,
  batchUpsertIncidents,
} from "@/src/lib/incidents";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for this route

/**
 * Cron job endpoint for ingesting accident news.
 *
 * This endpoint:
 * 1. Fetches Google News RSS feeds for configured queries
 * 2. Filters and normalizes items to incident candidates
 * 3. De-duplicates candidates
 * 4. Upserts incidents to the database
 *
 * Protected by CRON_SECRET for Vercel Cron Jobs authentication.
 *
 * @route GET /api/cron/ingest-news
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
  const feedErrors: string[] = [];
  const allCandidates: ReturnType<typeof toIncidentCandidates> = [];

  console.log(`[ingest-news] Starting ingestion with ${GOOGLE_NEWS_QUERIES.length} queries`);

  // Fetch all feeds in parallel (in batches to avoid overwhelming the network)
  const BATCH_SIZE = 5;
  for (let i = 0; i < GOOGLE_NEWS_QUERIES.length; i += BATCH_SIZE) {
    const batch = GOOGLE_NEWS_QUERIES.slice(i, i + BATCH_SIZE);
    const urls = batch.map(buildGoogleNewsRssUrl);

    const results = await Promise.allSettled(urls.map(fetchGoogleNewsFeed));

    results.forEach((result, idx) => {
      const query = batch[idx];
      if (result.status === "fulfilled") {
        const candidates = toIncidentCandidates(result.value);
        allCandidates.push(...candidates);
        console.log(
          `[ingest-news] Query "${query}": ${result.value.length} items -> ${candidates.length} candidates`
        );
      } else {
        const errorMsg = `Query "${query}": ${result.reason?.message ?? String(result.reason)}`;
        feedErrors.push(errorMsg);
        console.error(`[ingest-news] ${errorMsg}`);
      }
    });
  }

  console.log(`[ingest-news] Total candidates before dedup: ${allCandidates.length}`);

  // De-duplicate candidates
  const uniqueCandidates = deduplicateCandidates(allCandidates);
  console.log(`[ingest-news] Unique candidates after dedup: ${uniqueCandidates.length}`);

  // Upsert to database
  const upsertResult = await batchUpsertIncidents(uniqueCandidates);

  const duration = Date.now() - startTime;

  const response = {
    ok: true,
    duration: `${duration}ms`,
    queriesProcessed: GOOGLE_NEWS_QUERIES.length,
    totalItemsFetched: allCandidates.length,
    uniqueCandidates: uniqueCandidates.length,
    newIncidents: upsertResult.newIncidents,
    updatedIncidents: upsertResult.updatedIncidents,
    skipped: upsertResult.skipped,
    feedErrors: feedErrors.length,
    saveErrors: upsertResult.errors.length,
    errors: [...feedErrors, ...upsertResult.errors],
  };

  console.log(`[ingest-news] Completed:`, {
    ...response,
    errors: `${response.errors.length} error(s)`,
  });

  return NextResponse.json(response);
}
