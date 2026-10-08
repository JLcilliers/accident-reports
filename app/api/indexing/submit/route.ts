import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  submitUrlForIndexing,
  submitUrlsForIndexing,
  buildIncidentUrl,
} from "@/lib/google/indexing";

/**
 * POST /api/indexing/submit
 *
 * Submit URLs to Google Indexing API for faster crawling.
 *
 * Body options:
 * - { slug: string } - Submit a single incident by slug
 * - { slugs: string[] } - Submit multiple incidents by slug
 * - { url: string } - Submit a single arbitrary URL
 * - { urls: string[] } - Submit multiple arbitrary URLs
 * - { all: true, limit?: number } - Submit all incidents (with optional limit)
 *
 * Requires CRON_SECRET header for authentication.
 */
const indexingEnabled = () => process.env.GOOGLE_INDEXING_ENABLED === "true";

export async function POST(request: NextRequest) {
  if (!indexingEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Authenticate
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Single slug
    if (body.slug && typeof body.slug === "string") {
      const url = buildIncidentUrl(body.slug);
      const result = await submitUrlForIndexing(url);
      return NextResponse.json(result);
    }

    // Multiple slugs
    if (body.slugs && Array.isArray(body.slugs)) {
      const urls = body.slugs.map((slug: string) => buildIncidentUrl(slug));
      const results = await submitUrlsForIndexing(urls);
      return NextResponse.json({
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      });
    }

    // Single URL
    if (body.url && typeof body.url === "string") {
      const result = await submitUrlForIndexing(body.url);
      return NextResponse.json(result);
    }

    // Multiple URLs
    if (body.urls && Array.isArray(body.urls)) {
      const results = await submitUrlsForIndexing(body.urls);
      return NextResponse.json({
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      });
    }

    // Submit all incidents
    if (body.all === true) {
      const limit = typeof body.limit === "number" ? body.limit : 100;

      const incidents = await prisma.incident.findMany({
        where: {
          articleBody: { not: null }, // Only submit incidents with generated content
        },
        select: { slug: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      const urls = incidents.map((i) => buildIncidentUrl(i.slug));
      const results = await submitUrlsForIndexing(urls);

      return NextResponse.json({
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      });
    }

    return NextResponse.json(
      {
        error: "Invalid request body",
        usage: {
          single: "{ slug: 'incident-slug' }",
          multiple: "{ slugs: ['slug1', 'slug2'] }",
          url: "{ url: 'https://...' }",
          urls: "{ urls: ['https://...', 'https://...'] }",
          all: "{ all: true, limit?: number }",
        },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Indexing API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexing/submit
 *
 * Returns usage information
 */
export async function GET() {
  if (!indexingEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    description: "Google Indexing API submission endpoint",
    authentication: "Bearer token using CRON_SECRET",
    endpoints: {
      "POST /api/indexing/submit": {
        description: "Submit URLs for indexing",
        body: {
          slug: "Submit single incident by slug",
          slugs: "Submit multiple incidents by slug array",
          url: "Submit single arbitrary URL",
          urls: "Submit multiple arbitrary URLs",
          all: "Submit all incidents with content (limit optional)",
        },
      },
    },
    setup: {
      step1: "Create Google Cloud project and enable Indexing API",
      step2: "Create service account with Indexing API access",
      step3: "Download JSON key and add to GOOGLE_INDEXING_CREDENTIALS env var",
      step4: "Add service account email as owner in Google Search Console",
    },
  });
}
