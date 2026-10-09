import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { buildScene } from "@/lib/images/scene";
import { MAX_ATTEMPTS, createIllustration } from "@/lib/images/illustrate";

export const maxDuration = 300;

const MAX_PER_RUN = 20;
const CONCURRENCY = 4;

/**
 * Cron: generate illustrations for incidents that have a published article.
 *
 * Scheduled runs do nothing until IMAGE_SINCE (an ISO date) is set, and then only
 * pick incidents created on or after it. `?test=N` processes exactly N eligible
 * incidents (default 5), oldest first, regardless of IMAGE_SINCE. Both respect the
 * daily cap in IMAGE_DAILY_LIMIT (default 50) and never retry an item automatically.
 *
 * @route GET /api/cron/generate-images
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const testParam = req.nextUrl.searchParams.get("test");
  const testMode = testParam !== null;
  // Preview deployments sit behind Vercel Authentication, so test mode there needs no cron secret.
  const previewTest = testMode && process.env.VERCEL_ENV === "preview";

  if (process.env.NODE_ENV === "production" && !previewTest) {
    if (!cronSecret) {
      console.error("CRON_SECRET is not configured");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const requested = testMode ? Math.max(1, Math.min(MAX_PER_RUN, Number(testParam) || 5)) : MAX_PER_RUN;

  const sinceRaw = process.env.IMAGE_SINCE;
  const since = sinceRaw ? new Date(sinceRaw) : null;
  if (!testMode && (!since || Number.isNaN(since.getTime()))) {
    return NextResponse.json({ ok: true, disabled: true, reason: "IMAGE_SINCE is not set" });
  }

  const dailyLimit = Number(process.env.IMAGE_DAILY_LIMIT) || 50;
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const usedToday = await prisma.incident.count({ where: { imageGeneratedAt: { gte: dayStart } } });
  const take = Math.min(requested, Math.max(0, dailyLimit - usedToday));
  if (take === 0) {
    return NextResponse.json({ ok: true, processed: 0, reason: `daily limit of ${dailyLimit} reached` });
  }

  const incidents = await prisma.incident.findMany({
    where: {
      articleBody: { not: null },
      imageStatus: "NONE",
      imageAttempts: { lt: MAX_ATTEMPTS },
      ...(testMode || !since ? {} : { createdAt: { gte: since } }),
    },
    orderBy: { createdAt: "asc" },
    take,
    select: { id: true, slug: true, headline: true, articleBody: true, extractedFacts: true },
  });

  const results: Record<string, unknown>[] = [];

  for (let i = 0; i < incidents.length; i += CONCURRENCY) {
    const batch = incidents.slice(i, i + CONCURRENCY);
    const done = await Promise.all(
      batch.map(async (incident) => {
        // Reserve both attempts first so a crash mid-run can never cause an automatic retry.
        await prisma.incident.update({
          where: { id: incident.id },
          data: { imageAttempts: MAX_ATTEMPTS, imageGeneratedAt: new Date() },
        });

        const scene = buildScene({
          headline: incident.headline,
          articleBody: incident.articleBody,
          extractedFacts: incident.extractedFacts as AccidentFacts | null,
        });
        const result = await createIllustration(incident.slug, scene.description);

        await prisma.incident.update({
          where: { id: incident.id },
          data: {
            imageStatus: result.status,
            imageUrl: result.url,
            imageAlt: result.alt,
            imageModel: result.model,
            imageCostUsd: result.costUsd,
            imageAttempts: result.attempts.length,
            imageGeneratedAt: new Date(),
          },
        });

        return {
          slug: incident.slug,
          status: result.status,
          url: result.url,
          alt: result.alt,
          scene: scene.description,
          costUsd: result.costUsd,
          attempts: result.attempts,
        };
      })
    );
    results.push(...done);
  }

  const ok = results.filter((r) => r.status === "OK").length;
  // First 12 hex characters of the key's SHA-256, so the stored value can be compared without revealing it.
  const keyFingerprint = process.env.OPENROUTER_API_KEY
    ? createHash("sha256").update(process.env.OPENROUTER_API_KEY).digest("hex").slice(0, 12)
    : null;
  const failed = results.length - ok;
  const totalCostUsd = results.reduce((sum, r) => sum + (r.costUsd as number), 0);
  const summary = {
    ok: results.length === 0 || ok > 0,
    testMode,
    keyFingerprint,
    processed: results.length,
    succeeded: ok,
    failed,
    totalCostUsd: Number(totalCostUsd.toFixed(6)),
    dailyLimit,
    usedTodayBefore: usedToday,
    results,
  };

  console.log("[generate-images] Completed:", JSON.stringify({ ...summary, results: undefined }));
  return NextResponse.json(summary, { status: results.length > 0 && ok === 0 ? 500 : 200 });
}
