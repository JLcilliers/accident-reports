import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { extractAccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { generateIncidentArticle, incidentSourceTexts } from "@/lib/seo/generateIncidentArticle";
import { claimArticle, releaseForSecondPublisher } from "@/lib/seo/claim";
import { checkRoadCrash } from "@/lib/seo/checkRoadCrash";
import { fetchPublisherText } from "@/lib/seo/fetchPublisherText";
import { generateIncidentBrief } from "@/lib/seo/brief";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";

export const runtime = "nodejs";
export const maxDuration = 300; // Allow up to 5 minutes for this route

// Same format as the image cron's cutoff: a full date-time with an explicit zone.
const START_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

// After this many attempts an incident is marked FAILED and never picked again automatically.
const MAX_ATTEMPTS = 2;
const MAX_PER_RUN = 10;
// Starts the note on incidents the crash check rejected, so they can be told apart from other failures.
const NOT_A_CRASH_NOTE = "not a road crash";
// An incident (text lookup up to 25 s, then facts plus up to two article drafts) takes up to about 70 s, so a
// new one starts only while 75 s remain.
const RUN_BUDGET_MS = 270_000;
const MIN_ITEM_MS = 75_000;

/**
 * Cron job endpoint for backfilling SEO content on existing incidents.
 *
 * This endpoint claims incidents one at a time (see claimArticle) that were created on or after
 * IMAGE_START_DATE and have no article, so the older backlog is never billed. For each it looks for the story's
 * full text on a publisher's own site (see fetchPublisherText); an incident covered by only one publisher goes
 * ahead only when that text is found, and otherwise gets a short brief (see generateIncidentBrief) and waits for
 * a second publisher, when it is claimed again for the full article. It then checks that the
 * coverage is about a real road crash (anything else is marked FAILED with a "not a road crash" note and never
 * claimed again), extracts
 * structured facts and writes the article, all through OpenRouter. The publisher's text is model input only.
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
  let withPublisherText = 0;
  let waitingForSecondPublisher = 0;
  let briefsWritten = 0;
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
        select: { title: true, snippet: true, publisher: true, publisherDomain: true },
      });

      const publisherText = await fetchPublisherText(sources);
      if (publisherText) withPublisherText++;
      if (!publisherText && incident.publishers < 2) {
        // Only one publisher's headline to go on: a short brief, kept out of search until a second publisher
        // reports the crash and the full article replaces it. A headline judged not to be a crash, or a brief
        // that fails, just waits for a second publisher, so a verdict on one headline never fails it for good.
        let brief: string | null = null;
        try {
          const crashCheck = await checkRoadCrash(incident.headline, incidentSourceTexts(sources));
          if (crashCheck.crash) brief = await generateIncidentBrief({ ...incident, sources });
          else console.log(`[generate-seo] No brief, headline may not be a road crash: ${incident.slug} (${crashCheck.reason})`);
        } catch (error) {
          console.warn(`[generate-seo] No brief for ${incident.slug}:`, error instanceof Error ? error.message : error);
        }
        if (!brief) {
          await releaseForSecondPublisher(prisma, incident.id);
          waitingForSecondPublisher++;
          console.log(`[generate-seo] One publisher and no text from its site, waiting for a second: ${incident.slug}`);
          continue;
        }
        // Attempts start again at 0, so the full article gets all of its own once a second publisher appears.
        await prisma.incident.update({
          where: { id: incident.id },
          data: { articleBody: brief, articleAttempts: 0, articleQualityStatus: "OK", articleQualityNotes: null },
        });
        briefsWritten++;
        console.log(`[generate-seo] Wrote a brief: ${incident.slug}`);
        continue;
      }

      const crashCheck = await checkRoadCrash(incident.headline, incidentSourceTexts(sources));
      if (!crashCheck.crash) {
        // FAILED with every attempt used, like the image job's non-crashes, so it is never claimed again.
        await prisma.incident.update({
          where: { id: incident.id },
          data: {
            articleBody: null, // Removes a brief written from the first headline, if there is one.
            articleQualityStatus: "FAILED",
            articleQualityNotes: `${NOT_A_CRASH_NOTE}${crashCheck.reason ? `: ${crashCheck.reason}` : ""}`.slice(0, 1000),
            articleAttempts: MAX_ATTEMPTS,
          },
        });
        notACrash++;
        console.log(`[generate-seo] Not a road crash, skipped for good: ${incident.slug} (${crashCheck.reason})`);
        continue;
      }

      let facts = incident.extractedFacts as AccidentFacts | null;
      if (!facts) {
        console.log(`[generate-seo] Extracting facts for: ${incident.slug}`);
        const combinedText = [...incidentSourceTexts(sources), publisherText ?? ""].filter(Boolean).join("\n\n") || incident.headline;
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
          publisherText,
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
    withPublisherText,
    waitingForSecondPublisher,
    briefsWritten,
    failed,
    errors: errors.slice(0, 10), // Limit errors in response
  };

  console.log(`[generate-seo] Completed:`, response);

  return NextResponse.json(response);
}
