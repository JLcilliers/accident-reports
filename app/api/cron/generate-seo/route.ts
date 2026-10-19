import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { extractAccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { generateIncidentArticle } from "@/lib/seo/generateIncidentArticle";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";

export const runtime = "nodejs";
export const maxDuration = 300; // Allow up to 5 minutes for this route

// Same format as the image cron's cutoff: a full date-time with an explicit zone.
const START_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

/**
 * Cron job endpoint for backfilling SEO content on existing incidents.
 *
 * This endpoint:
 * 1. Finds incidents created on or after IMAGE_START_DATE without SEO content or extracted facts,
 *    so the older backlog without articles is never billed
 * 2. Extracts structured facts from news sources through OpenRouter
 * 3. Generates SEO articles using the extracted facts
 * 4. Updates the incidents with both facts and generated content
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

  const startTime = Date.now();
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  // Find incidents without SEO content OR without extracted facts
  const incidents = await prisma.incident.findMany({
    where: {
      createdAt: { gte: start },
      OR: [
        { articleBody: null },
        { extractedFacts: { equals: Prisma.DbNull } },
      ],
    },
    include: {
      sources: {
        take: 5,
        select: { title: true, snippet: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 50), // Cap at 50 per run to avoid timeouts
  });

  console.log(`[generate-seo] Found ${incidents.length} incidents needing processing`);

  let factsExtracted = 0;
  let articlesGenerated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const incident of incidents) {
    try {
      // Build combined text from sources for fact extraction
      const combinedText = incident.sources
        .map((s) => `${s.title}. ${s.snippet || ""}`)
        .join("\n\n") || `${incident.headline}. ${incident.summary || ""}`;

      // Check if we need to extract facts
      let facts: AccidentFacts | null = incident.extractedFacts as AccidentFacts | null;

      if (!facts) {
        console.log(`[generate-seo] Extracting facts for: ${incident.slug}`);
        facts = await extractAccidentFacts(incident.headline, combinedText);

        if (facts) {
          factsExtracted++;
        }
      }

      // Check if we need to generate article
      let seoContent = null;
      if (!incident.articleBody) {
        console.log(`[generate-seo] Generating article for: ${incident.slug}`);
        seoContent = await generateIncidentArticle(
          {
            headline: incident.headline,
            summary: incident.summary,
            city: incident.city,
            state: incident.state,
            occurredAt: incident.occurredAt,
            sources: incident.sources,
          },
          facts // Pass extracted facts to enrich the article
        );

        if (seoContent) {
          articlesGenerated++;
        }
      }

      // Update incident with facts and/or SEO content
      if (facts || seoContent) {
        await prisma.incident.update({
          where: { id: incident.id },
          data: {
            ...(facts && !incident.extractedFacts && { extractedFacts: facts as unknown as Prisma.InputJsonValue }),
            ...(seoContent && {
              seoTitle: seoContent.seoTitle,
              seoDescription: seoContent.seoDescription,
              articleBody: seoContent.articleBody,
            }),
          },
        });
        console.log(`[generate-seo] Updated: ${incident.slug}`);
      } else {
        failed++;
        errors.push(`No content generated for ${incident.slug}`);
      }
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${incident.slug}: ${message}`);
      console.error(`[generate-seo] Error for ${incident.slug}:`, message);
    }

    // Small delay to avoid rate limiting (increased for two API calls)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const duration = Date.now() - startTime;

  const response = {
    ok: true,
    duration: `${duration}ms`,
    incidentsProcessed: incidents.length,
    factsExtracted,
    articlesGenerated,
    failed,
    errors: errors.slice(0, 10), // Limit errors in response
  };

  console.log(`[generate-seo] Completed:`, response);

  return NextResponse.json(response);
}
