import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { extractAccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { generateIncidentArticle, incidentSourceTexts } from "@/lib/seo/generateIncidentArticle";
import { claimArticle } from "@/lib/seo/claim";
import { checkRoadCrash } from "@/lib/seo/checkRoadCrash";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";

export const runtime = "nodejs";
export const maxDuration = 300; // Allow up to 5 minutes for this route

// Same format as the image cron's cutoff: a full date-time with an explicit zone.
const START_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

// After this many attempts an incident is marked FAILED and never picked again automatically.
const MAX_ATTEMPTS = 2;
const MAX_PER_RUN = 10;
// An incident (facts plus article) takes up to about 25 s, so a new one starts only while 60 s remain.
const RUN_BUDGET_MS = 270_000;
const MIN_ITEM_MS = 60_000;

/**
 * Cron job endpoint for backfilling SEO content on existing incidents.
 *
 * This endpoint claims incidents one at a time (see claimArticle) that were created on or after
 * IMAGE_START_DATE, have no article and are covered by at least two independent publishers, so the older
 * backlog is never billed. For each it first checks that the coverage is about a real road crash (anything
 * else is marked NOT_A_CRASH and never claimed again), then extracts structured facts and writes the article,
 * all through OpenRouter.
 * Each incident gets at most MAX_ATTEMPTS attempts, and attempts per UTC day stay within ARTICLE_DAILY_LIMIT
 * (default 100; 0 stops generation).
 *
 * Protected by CRON_SECRET for Vercel Cron Jobs authentication.
 *
 * @route GET /api/cron/generate-seo
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

  // Check if OpenRouter API key is configured
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY not configured" },
      { status: 500 }
    );
  }

  const startRaw = process.env.IMAGE_START_DATE?.trim();
  const start = startRaw && START_FORMAT.test(startRaw) ? new Date(startRaw) : null;
  if (!start || Number.isNaN(start.getTime())) {
    return NextResponse.json({
      ok: true,
      disabled: true,
      reason: "IMAGE_START_DATE is not set to a full ISO date-time with a zone",
    });
  }

  const limitRaw = process.env.ARTICLE_DAILY_LIMIT?.trim();
  const dailyLimit = limitRaw ? Number(limitRaw) : 100;
  if (!Number.isInteger(dailyLimit) || dailyLimit < 0) {
    return NextResponse.json({ ok: true, disabled: true, reason: "ARTICLE_DAILY_LIMIT is not a whole number of 0 or more" });
  }

  const startTime = Date.now();
  const deadline = startTime + RUN_BUDGET_MS;
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "10", 10) || 10, MAX_PER_RUN);

  let incidentsProcessed = 0;
  let factsExtracted = 0;
  let articlesGenerated = 0;
  let notACrash = 0;
  let failed = 0;
  let usedTodayBefore: number | null = null;
  const errors: string[] = [];

  while (incidentsProcessed < limit && deadline - Date.now() > MIN_ITEM_MS) {
    const { usedToday, claimed: incident } = await claimArticle(prisma, { start, dailyLimit, maxAttempts: MAX_ATTEMPTS });
    usedTodayBefore ??= usedToday;
    if (!incident) break;
    incidentsProcessed++;

    try {
      const sources = await prisma.incidentSource.findMany({
        where: { incidentId: incident.id },
        take: 5,
        select: { title: true, snippet: true, publisher: true },
      });

      const crashCheck = await checkRoadCrash(incident.headline, incidentSourceTexts(sources));
      if (!crashCheck.crash) {
        await prisma.incident.update({
          where: { id: incident.id },
          data: { articleQualityStatus: "NOT_A_CRASH", articleQualityNotes: crashCheck.reason || null },
        });
        notACrash++;
        console.log(`[generate-seo] Not a road crash, skipped for good: ${incident.slug} (${crashCheck.reason})`);
        continue;
      }

      let facts = incident.extractedFacts as AccidentFacts | null;
      if (!facts) {
        console.log(`[generate-seo] Extracting facts for: ${incident.slug}`);
        const combinedText = incidentSourceTexts(sources).join("\n\n") || incident.headline;
        facts = await extractAccidentFacts(incident.headline, combinedText);
        if (facts) {
          factsExtracted++;
          await prisma.incident.update({
            where: { id: incident.id },
            data: { extractedFacts: facts as unknown as Prisma.InputJsonValue },
          });
        }
      }

      console.log(`[generate-seo] Generating article for: ${incident.slug} (attempt ${incident.articleAttempts})`);
      const seoContent = await generateIncidentArticle(
        {
          headline: incident.headline,
          summary: incident.summary,
          city: incident.city,
          state: incident.state,
          occurredAt: incident.occurredAt,
          sources,
        },
        facts
      );
      if (!seoContent) throw new Error("No article generated");

      await prisma.incident.update({
        where: { id: incident.id },
        data: {
          seoTitle: seoContent.seoTitle,
          seoDescription: seoContent.seoDescription,
          articleBody: seoContent.articleBody,
          articleQualityStatus: "OK",
          articleQualityNotes: null,
        },
      });
      articlesGenerated++;
      console.log(`[generate-seo] Updated: ${incident.slug}`);
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${incident.slug}: ${message}`);
      console.error(`[generate-seo] Error for ${incident.slug}:`, message);
      await prisma.incident.update({
        where: { id: incident.id },
        data: {
          articleQualityNotes: message.slice(0, 1000),
          ...(incident.articleAttempts >= MAX_ATTEMPTS && { articleQualityStatus: "FAILED" }),
        },
      });
    }
  }

  const duration = Date.now() - startTime;

  const response = {
    ok: true,
    duration: `${duration}ms`,
    dailyLimit,
    usedTodayBefore,
    incidentsProcessed,
    factsExtracted,
    articlesGenerated,
    notACrash,
    failed,
    errors: errors.slice(0, 10), // Limit errors in response
  };

  console.log(`[generate-seo] Completed:`, response);

  return NextResponse.json(response);
}
