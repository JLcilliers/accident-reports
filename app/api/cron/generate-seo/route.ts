import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateIncidentArticle } from "@/lib/seo/generateIncidentArticle";

export const runtime = "nodejs";
export const maxDuration = 300; // Allow up to 5 minutes for this route

/**
 * Cron job endpoint for backfilling SEO content on existing incidents.
 *
 * This endpoint:
 * 1. Finds incidents without SEO content
 * 2. Generates SEO articles using OpenAI
 * 3. Updates the incidents with the generated content
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

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 }
    );
  }

  const startTime = Date.now();
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  // Find incidents without SEO content
  const incidents = await prisma.incident.findMany({
    where: {
      articleBody: null,
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

  console.log(`[generate-seo] Found ${incidents.length} incidents without SEO content`);

  let generated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const incident of incidents) {
    try {
      const seoContent = await generateIncidentArticle({
        headline: incident.headline,
        summary: incident.summary,
        city: incident.city,
        state: incident.state,
        occurredAt: incident.occurredAt,
        sources: incident.sources,
      });

      if (seoContent) {
        await prisma.incident.update({
          where: { id: incident.id },
          data: {
            seoTitle: seoContent.seoTitle,
            seoDescription: seoContent.seoDescription,
            articleBody: seoContent.articleBody,
          },
        });
        generated++;
        console.log(`[generate-seo] Generated article for: ${incident.slug}`);
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

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const duration = Date.now() - startTime;

  const response = {
    ok: true,
    duration: `${duration}ms`,
    incidentsProcessed: incidents.length,
    generated,
    failed,
    errors: errors.slice(0, 10), // Limit errors in response
  };

  console.log(`[generate-seo] Completed:`, response);

  return NextResponse.json(response);
}
