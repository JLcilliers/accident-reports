import { NextRequest, NextResponse } from "next/server";
import { createIllustration } from "@/lib/images/illustrate";
import { GUIDE_INDEX_SCENE, GUIDE_SCENES } from "@/lib/images/guideScenes";

export const maxDuration = 300;

const CONCURRENCY = 4;

/**
 * Generates hero illustrations for the crash-report guides on request only (never scheduled).
 * `?slugs=texas,arizona` or `?slugs=all`; "index" is the guides index page.
 * Returns each Blob URL, alt text and cost so they can be stored with the guide data.
 *
 * @route GET /api/admin/generate-guide-heroes
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requested = (req.nextUrl.searchParams.get("slugs") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const all = ["index", ...Object.keys(GUIDE_SCENES)];
  const slugs = requested.includes("all") ? all : requested.filter((s) => all.includes(s));
  if (slugs.length === 0) {
    return NextResponse.json({ error: "Pass ?slugs=all or a comma-separated list of guide slugs" }, { status: 400 });
  }

  const results: Record<string, unknown>[] = [];
  for (let i = 0; i < slugs.length; i += CONCURRENCY) {
    const batch = slugs.slice(i, i + CONCURRENCY);
    const done = await Promise.all(
      batch.map(async (slug) => {
        const scene = slug === "index" ? GUIDE_INDEX_SCENE : GUIDE_SCENES[slug];
        const result = await createIllustration(`guides/${slug}`, scene);
        return { slug, status: result.status, url: result.url, alt: result.alt, model: result.model, costUsd: result.costUsd, attempts: result.attempts };
      })
    );
    results.push(...done);
  }

  const succeeded = results.filter((r) => r.status === "OK").length;
  const totalCostUsd = results.reduce((sum, r) => sum + (r.costUsd as number), 0);
  console.log(`[generate-guide-heroes] ${succeeded}/${results.length} OK, $${totalCostUsd.toFixed(6)}`);
  return NextResponse.json(
    { processed: results.length, succeeded, failed: results.length - succeeded, totalCostUsd: Number(totalCostUsd.toFixed(6)), results },
    { status: succeeded === 0 ? 500 : 200 }
  );
}
