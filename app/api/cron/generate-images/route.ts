import { createHash } from "crypto";
import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { putBefore } from "@/lib/images/blob";
import { compositionByName, pickComposition, seedOf, type Composition, type Look } from "@/lib/images/compositions";
import { MAX_ATTEMPTS, createIllustration, type AttemptLog, type DrawPlan } from "@/lib/images/illustrate";
import { IMAGE_MODEL, openRouterReady } from "@/lib/images/openrouter";
import { hashFromUrl } from "@/lib/images/phash";
import { sceneCues, type SceneCues } from "@/lib/images/scene";
import { claimIncidents, recentImages, saveIllustration, type ClaimedIncident } from "@/lib/images/store";

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
// dHash distance (out of 64) at or under which a new image counts as too similar to one of the last 50.
// In testing, two near-identical side-on sedans sat 14 apart and different compositions 16 or more.
const SIMILARITY_THRESHOLD = 14;

interface ItemResult {
  slug: string;
  status: "OK" | "FAILED";
  url: string | null;
  alt: string | null;
  model: string;
  composition: string | null;
  look: Look | null;
  cues: SceneCues | null;
  prompt: string | null;
  hash: string | null;
  nearest: number | null;
  costUsd: number;
  attempts: AttemptLog[];
  error?: string;
}

/** Compositions of recent images (newest first) and the hashes to keep new images away from. */
interface History {
  names: string[];
  hashes: string[];
}

/**
 * Cron: generate illustrations for incidents whose article was published on or after IMAGE_START_DATE.
 *
 * Scheduled runs do nothing until IMAGE_START_DATE (an ISO date-time with a zone) is set, and then only
 * claim incidents created on or after it, so an article that existed before that moment never gets an
 * image. They first check that OpenRouter accepts the key and has credit, claim four incidents at a time,
 * stay within IMAGE_DAILY_LIMIT (default 50; 0 stops generation) and never retry an item automatically.
 * Each image gets a composition not used in the last 10, and one that hashes too close to any of the
 * last 50 is drawn again once in a different composition.
 *
 * `?test=N` is a dry run that never writes to the database: it draws illustrations for the N most recent
 * incidents with an article (at most 12 a call and 36 a day) and stores each image, with a JSON record of
 * its result, under illustrations/tests/<UTC day>/. `&compositions=a,b,...` draws one image per named
 * composition instead of picking, and `&skip=N` starts N incidents further back.
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
  if (testParam === null) return runScheduled();

  const named = req.nextUrl.searchParams.get("compositions");
  const forced = named ? named.split(",").map((n) => compositionByName(n.trim())) : null;
  if (forced && forced.some((c) => !c)) {
    return NextResponse.json({ error: "Unknown composition name in ?compositions=" }, { status: 400 });
  }
  const skip = Math.max(0, Math.floor(Number(req.nextUrl.searchParams.get("skip")) || 0));
  return runTest(forced ? forced.length : Number(testParam) || 5, forced as Composition[] | null, skip);
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

  const history = await loadHistory();
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

    const batch = await illustrateBatch(claimed, history, null, (incident) => incident.slug, deadline, (incident, item) =>
      saveIllustration(prisma, incident.id, {
        status: item.status,
        url: item.url,
        alt: item.alt,
        model: item.model,
        costUsd: item.costUsd,
        attempts: item.attempts.filter((attempt) => !attempt.skipped).length,
        composition: item.composition,
        hash: item.hash,
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

async function runTest(requested: number, forced: Composition[] | null, skip: number) {
  const deadline = Date.now() + RUN_BUDGET_MS;
  const run = new Date().toISOString();
  const day = run.slice(0, 10);
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
    skip,
    take,
    select: { id: true, slug: true, headline: true, articleBody: true, extractedFacts: true, occurredAt: true, createdAt: true },
  });
  const history = await loadHistory();

  const results: ItemResult[] = [];
  for (let i = 0; i < incidents.length && deadline - Date.now() > MIN_BATCH_MS; i += CONCURRENCY) {
    const slice = incidents.slice(i, i + CONCURRENCY);
    results.push(
      ...(await illustrateBatch(
        slice,
        history,
        forced ? forced.slice(i, i + CONCURRENCY) : null,
        (incident) => `tests/${day}/${incident.slug}`,
        deadline,
        async (incident, item) => {
          const source = slice.find((s) => s.id === incident.id);
          const record = {
            run,
            ...item,
            compositionLabel: item.composition ? compositionByName(item.composition)?.label ?? null : null,
            headline: incident.headline,
            incidentCreatedAt: source?.createdAt ?? null,
          };
          await putBefore(deadline, `${prefix}${incident.slug}.json`, JSON.stringify(record), {
            access: "public",
            contentType: "application/json",
            addRandomSuffix: true,
          });
        }
      ))
    );
  }
  return summarise(results, { testMode: true, dryRun: true, run, testDailyLimit: TEST_DAILY_LIMIT, testImagesTodayBefore: usedToday });
}

/** Compositions and hashes of the last 50 stored images; older images without a stored hash are hashed now. */
async function loadHistory(): Promise<History> {
  const recent = await recentImages(prisma);
  const hashes = await Promise.all(recent.map((image) => image.imageHash ?? (image.imageUrl ? hashFromUrl(image.imageUrl) : null)));
  return {
    names: recent.map((image) => image.imageComposition).filter((name): name is string => !!name),
    hashes: hashes.filter((hash): hash is string => !!hash),
  };
}

/**
 * Draws one batch in parallel and hands each result to `store`, trying a failed store once more. Each
 * incident gets its composition before the batch starts, so images drawn side by side never share one.
 * Anything that goes wrong for one incident marks only that item failed; it is still stored or reported.
 */
async function illustrateBatch(
  incidents: ClaimedIncident[],
  history: History,
  forced: Composition[] | null,
  keyFor: (incident: ClaimedIncident) => string,
  deadline: number,
  store: (incident: ClaimedIncident, item: ItemResult) => Promise<void>
): Promise<ItemResult[]> {
  const planned = incidents.map((incident, i): { incident: ClaimedIncident; plan?: DrawPlan; error?: string } => {
    try {
      const cues = sceneCues({
        headline: incident.headline,
        articleBody: incident.articleBody,
        extractedFacts: incident.extractedFacts as AccidentFacts | null,
        occurredAt: incident.occurredAt,
      });
      const seed = seedOf(incident.slug);
      const first = forced?.[i] ?? pickComposition(cues, history.names, seed);
      const second = forced?.[i] ?? pickComposition(cues, history.names, seed, [first.name]);
      history.names.unshift(first.name);
      return { incident, plan: { cues, seed, compositions: [first, second] } };
    } catch (error) {
      return { incident, error: error instanceof Error ? error.message : String(error) };
    }
  });
  const similarity = { hashes: [...history.hashes], threshold: SIMILARITY_THRESHOLD };

  const items = await Promise.all(
    planned.map(async ({ incident, plan, error }) => {
      let item: ItemResult;
      try {
        if (!plan) throw new Error(error);
        const result = await createIllustration(keyFor(incident), plan, deadline, similarity);
        item = {
          slug: incident.slug,
          status: result.status,
          url: result.url,
          alt: result.alt,
          model: result.model,
          composition: result.composition,
          look: result.look,
          cues: plan.cues,
          prompt: result.prompt,
          hash: result.hash,
          nearest: result.nearest,
          costUsd: result.costUsd,
          attempts: result.attempts,
        };
      } catch (failure) {
        const message = failure instanceof Error ? failure.message : String(failure);
        item = {
          slug: incident.slug,
          status: "FAILED",
          url: null,
          alt: null,
          model: IMAGE_MODEL,
          composition: null,
          look: null,
          cues: plan?.cues ?? null,
          prompt: null,
          hash: null,
          nearest: null,
          costUsd: 0,
          attempts: [],
          error: message,
        };
        console.error(`[generate-images] ${incident.slug}: ${message}`);
      }

      try {
        await store(incident, item).catch(async () => {
          await new Promise((resolve) => setTimeout(resolve, 1_000));
          await store(incident, item);
        });
      } catch (failure) {
        item.status = "FAILED";
        item.error = `storing the result failed: ${failure instanceof Error ? failure.message : String(failure)}`;
        console.error(`[generate-images] ${incident.slug}: ${item.error}`);
      }
      return item;
    })
  );

  items.forEach((item, i) => {
    if (item.status === "OK" && item.hash) history.hashes.unshift(item.hash);
    // The first composition is already in the history; add the second only when the image ended up using it.
    if (item.composition && item.composition !== planned[i].plan?.compositions[0].name) history.names.unshift(item.composition);
  });
  return items;
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
