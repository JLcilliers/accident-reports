import { createHash } from "crypto";
import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { putBefore } from "@/lib/images/blob";
import { buildScene } from "@/lib/images/scene";
import { MAX_ATTEMPTS, createIllustration, type AttemptLog } from "@/lib/images/illustrate";
import { IMAGE_MODEL, openRouterReady } from "@/lib/images/openrouter";
import { claimIncidents, saveIllustration, type ClaimedIncident } from "@/lib/images/store";

export const maxDuration = 300;

const MAX_PER_RUN = 20;
const CONCURRENCY = 4;
// Every item finishes well inside maxDuration (300 s), leaving room for a cold start, the upload and the save,
// so no claimed incident is left without a stored result.
const RUN_BUDGET_MS = 270_000;
// A new batch starts only while there is time for two full attempts and the save.
const MIN_BATCH_MS = 150_000;
const MAX_TEST_PER_RUN = 12;
const TEST_DAILY_LIMIT = 36;
// A full date-time with an explicit zone, so the cutoff can never silently fall at midnight or in another zone.
const START_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

interface ItemResult {
  slug: string;
  status: "OK" | "FAILED";
  url: string | null;
  alt: string | null;
  model: string;
  scene: string;
  costUsd: number;
  attempts: AttemptLog[];
  error?: string;
}

/**
 * Cron: generate illustrations for incidents whose article was published on or after IMAGE_START_DATE.
 *
 * Scheduled runs do nothing until IMAGE_START_DATE (an ISO date-time with a zone) is set, and then only
 * claim incidents created on or after it, so an article that existed before that moment never gets an
 * image. They first check that OpenRouter accepts the key and has credit, claim four incidents at a time,
 * stay within IMAGE_DAILY_LIMIT (default 50; 0 stops generation) and never retry an item automatically.
 *
 * `?test=N` is a dry run that never writes to the database: it draws illustrations for the N most recent
 * incidents with an article (at most 12 a call and 36 a day) and stores each image, with a JSON record of
 * its result, under illustrations/tests/<UTC day>/.
 *
 * @route GET /api/cron/generate-images
 */
export async function GET(req: NextRequest) {
  // Checked wherever the secret is configured, local development included, so no server is an open paid endpoint.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("CRON_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const testParam = req.nextUrl.searchParams.get("test");
  return testParam !== null ? runTest(Number(testParam) || 5) : runScheduled();
}

async function runScheduled() {
  const deadline = Date.now() + RUN_BUDGET_MS;
  const startRaw = process.env.IMAGE_START_DATE?.trim();
  const start = startRaw && START_FORMAT.test(startRaw) ? new Date(startRaw) : null;
  if (!start || Number.isNaN(start.getTime())) {
    const reason = startRaw
      ? "IMAGE_START_DATE must be a full ISO date-time with a zone, for example 2026-10-09T15:30:00Z"
      : "IMAGE_START_DATE is not set";
    return NextResponse.json({ ok: true, disabled: true, reason });
  }

  const limitRaw = process.env.IMAGE_DAILY_LIMIT?.trim();
  const dailyLimit = limitRaw ? Number(limitRaw) : 50;
  if (!Number.isInteger(dailyLimit) || dailyLimit < 0) {
    return NextResponse.json({ ok: true, disabled: true, reason: "IMAGE_DAILY_LIMIT is not a whole number of 0 or more" });
  }

  const ready = await openRouterReady();
  if (!ready.ok) {
    console.error(`[generate-images] Not started: ${ready.reason}`);
    return NextResponse.json({ ok: false, skipped: true, reason: ready.reason }, { status: 503 });
  }

  const results: ItemResult[] = [];
  let usedTodayBefore: number | null = null;
  let stoppedEarly: string | undefined;
  while (results.length < MAX_PER_RUN && deadline - Date.now() > MIN_BATCH_MS) {
    const { usedToday, claimed } = await claimIncidents(prisma, {
      start,
      dailyLimit,
      maxPerRun: Math.min(CONCURRENCY, MAX_PER_RUN - results.length),
      maxAttempts: MAX_ATTEMPTS,
    });
    usedTodayBefore ??= usedToday;
    if (claimed.length === 0) break;

    const batch = await illustrateBatch(claimed, (incident) => incident.slug, deadline, (incident, item) =>
      saveIllustration(prisma, incident.id, {
        status: item.status,
        url: item.url,
        alt: item.alt,
        model: item.model,
        costUsd: item.costUsd,
        attempts: item.attempts.filter((attempt) => !attempt.skipped).length,
      })
    );
    results.push(...batch);

    // A whole batch failing without a single billed call means the provider is refusing work; stop claiming.
    if (batch.every((item) => item.status === "FAILED" && item.costUsd === 0)) {
      stoppedEarly = "every image in the last batch failed before anything was billed";
      console.error(`[generate-images] Stopped early: ${stoppedEarly}`);
      break;
    }
  }
  return summarise(results, { testMode: false, imageStartDate: start.toISOString(), dailyLimit, usedTodayBefore, stoppedEarly });
}

async function runTest(requested: number) {
  const deadline = Date.now() + RUN_BUDGET_MS;
  const day = new Date().toISOString().slice(0, 10);
  const prefix = `illustrations/tests/${day}/`;
  // Every processed image leaves a JSON record, passed or failed, so each paid attempt counts towards the cap.
  const { blobs } = await list({ prefix, limit: 1000 });
  const usedToday = blobs.filter((blob) => blob.pathname.endsWith(".json")).length;
  const take = Math.min(Math.max(1, requested), MAX_TEST_PER_RUN, Math.max(0, TEST_DAILY_LIMIT - usedToday));
  if (take === 0) {
    return NextResponse.json({
      ok: true,
      testMode: true,
      dryRun: true,
      processed: 0,
      reason: `test limit of ${TEST_DAILY_LIMIT} images a day reached`,
    });
  }

  const ready = await openRouterReady();
  if (!ready.ok) {
    return NextResponse.json({ ok: false, testMode: true, dryRun: true, skipped: true, reason: ready.reason }, { status: 503 });
  }

  const incidents = await prisma.incident.findMany({
    where: { articleBody: { not: null } },
    orderBy: { createdAt: "desc" },
    take,
    select: { id: true, slug: true, headline: true, articleBody: true, extractedFacts: true },
  });

  const results: ItemResult[] = [];
  for (let i = 0; i < incidents.length && deadline - Date.now() > MIN_BATCH_MS; i += CONCURRENCY) {
    results.push(
      ...(await illustrateBatch(
        incidents.slice(i, i + CONCURRENCY),
        (incident) => `tests/${day}/${incident.slug}`,
        deadline,
        async (incident, item) => {
          await putBefore(deadline, `${prefix}${incident.slug}.json`, JSON.stringify({ ...item, headline: incident.headline }), {
            access: "public",
            contentType: "application/json",
            addRandomSuffix: true,
          });
        }
      ))
    );
  }
  return summarise(results, { testMode: true, dryRun: true, testDailyLimit: TEST_DAILY_LIMIT, testImagesTodayBefore: usedToday });
}

/**
 * Draws one batch in parallel, then hands each result to `store`, trying a failed store once more.
 * Anything that goes wrong for one incident marks only that item failed; it is still stored or reported.
 */
async function illustrateBatch(
  incidents: ClaimedIncident[],
  keyFor: (incident: ClaimedIncident) => string,
  deadline: number,
  store: (incident: ClaimedIncident, item: ItemResult) => Promise<void>
): Promise<ItemResult[]> {
  return Promise.all(
    incidents.map(async (incident) => {
      let item: ItemResult;
      try {
        const scene = buildScene({
          headline: incident.headline,
          articleBody: incident.articleBody,
          extractedFacts: incident.extractedFacts as AccidentFacts | null,
        });
        const result = await createIllustration(keyFor(incident), scene.description, deadline);
        item = {
          slug: incident.slug,
          status: result.status,
          url: result.url,
          alt: result.alt,
          model: result.model,
          scene: scene.description,
          costUsd: result.costUsd,
          attempts: result.attempts,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        item = { slug: incident.slug, status: "FAILED", url: null, alt: null, model: IMAGE_MODEL, scene: "", costUsd: 0, attempts: [], error: message };
        console.error(`[generate-images] ${incident.slug}: ${message}`);
      }

      try {
        await store(incident, item).catch(async () => {
          await new Promise((resolve) => setTimeout(resolve, 1_000));
          await store(incident, item);
        });
      } catch (error) {
        item.status = "FAILED";
        item.error = `storing the result failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[generate-images] ${incident.slug}: ${item.error}`);
      }
      return item;
    })
  );
}

function summarise(results: ItemResult[], extra: Record<string, unknown>) {
  const ok = results.filter((r) => r.status === "OK").length;
  // First 12 hex characters of the key's SHA-256, so the stored value can be compared without revealing it.
  const keyFingerprint = process.env.OPENROUTER_API_KEY
    ? createHash("sha256").update(process.env.OPENROUTER_API_KEY).digest("hex").slice(0, 12)
    : null;
  const totalCostUsd = results.reduce((sum, r) => sum + r.costUsd, 0);
  const summary = {
    ok: results.length === 0 || ok > 0,
    ...extra,
    keyFingerprint,
    processed: results.length,
    succeeded: ok,
    failed: results.length - ok,
    totalCostUsd: Number(totalCostUsd.toFixed(6)),
    results,
  };

  console.log("[generate-images] Completed:", JSON.stringify({ ...summary, results: undefined }));
  return NextResponse.json(summary, { status: results.length > 0 && ok === 0 ? 500 : 200 });
}
