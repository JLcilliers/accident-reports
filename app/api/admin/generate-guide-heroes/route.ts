import { NextRequest, NextResponse } from "next/server";
import { createIllustration } from "@/lib/images/illustrate";
import { openRouterReady } from "@/lib/images/openrouter";
import { GUIDE_INDEX_SCENE, GUIDE_SCENES } from "@/lib/images/guideScenes";

export const maxDuration = 300;

const CONCURRENCY = 4;
const MAX_PER_CALL = 12;
// Every image finishes well inside maxDuration (300 s); a batch starts only with time for two full attempts.
const RUN_BUDGET_MS = 270_000;
const MIN_BATCH_MS = 150_000;

/**
 * Generates hero illustrations for the crash-report guides on request only (never scheduled).
 * `?slugs=texas,arizona` or `?slugs=all`; "index" is the guides index page. At most 12 per call:
 * anything not drawn comes back in `remaining` for the next call.
 * Returns each Blob URL, alt text and cost so they can be stored with the guide data.
 *
 * @route GET /api/admin/generate-guide-heroes
 */
export async function GET(req: NextRequest) {
  const deadline = Date.now() + RUN_BUDGET_MS;
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requested = [...new Set((req.nextUrl.searchParams.get("slugs") || "").split(",").map((s) => s.trim()).filter(Boolean))];
  const all = ["index", ...Object.keys(GUIDE_SCENES)];
  const wanted = requested.includes("all") ? all : requested.filter((s) => all.includes(s));
  if (wanted.length === 0) {
    return NextResponse.json({ error: "Pass ?slugs=all or a comma-separated list of guide slugs" }, { status: 400 });
  }
  const slugs = wanted.slice(0, MAX_PER_CALL);

  const ready = await openRouterReady();
  if (!ready.ok) {
    return NextResponse.json({ error: `Not started: ${ready.reason}` }, { status: 503 });
  }

  const results: Record<string, unknown>[] = [];
  for (let i = 0; i < slugs.length && deadline - Date.now() > MIN_BATCH_MS; i += CONCURRENCY) {
    const batch = slugs.slice(i, i + CONCURRENCY);
    const done = await Promise.all(
      batch.map(async (slug) => {
        const scene = slug === "index" ? GUIDE_INDEX_SCENE : GUIDE_SCENES[slug];
        const result = await createIllustration(`guides/${slug}`, scene, deadline);
        const item = { slug, status: result.status, url: result.url, alt: result.alt, model: result.model, costUsd: result.costUsd, attempts: result.attempts };
        // Logged as each image finishes, so the URLs and alt text survive even if the response is lost.
        console.log(`[generate-guide-heroes] ${JSON.stringify(item)}`);
        return item;
      })
    );
    results.push(...done);
  }

  const remaining = wanted.slice(results.length);
  const succeeded = results.filter((r) => r.status === "OK").length;
  const totalCostUsd = results.reduce((sum, r) => sum + (r.costUsd as number), 0);
  console.log(`[generate-guide-heroes] ${succeeded}/${results.length} OK, $${totalCostUsd.toFixed(6)}, ${remaining.length} remaining`);
  return NextResponse.json(
    { processed: results.length, succeeded, failed: results.length - succeeded, totalCostUsd: Number(totalCostUsd.toFixed(6)), results, remaining },
    { status: succeeded === 0 ? 500 : 200 }
  );
}
