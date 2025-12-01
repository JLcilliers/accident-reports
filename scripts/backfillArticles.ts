/**
 * Backfill script for generating 12-section AI articles for incidents.
 *
 * Features:
 * - Batch processing with configurable BATCH_SIZE
 * - Retry logic per incident (MAX_RETRIES)
 * - Central article validation via validateIncidentArticle
 * - Quality status tracking (OK, NEEDS_REVIEW, FAILED)
 * - Safe to re-run (skips incidents that already have articleBody)
 *
 * Usage:
 *   npx tsx scripts/backfillArticles.ts
 */

// Load environment variables from .env.local (override system env vars)
import { config } from "dotenv";
config({ path: ".env.local", override: true });

import { PrismaClient, Prisma, ArticleQualityStatus } from "@prisma/client";
import { extractAccidentFacts, type AccidentFacts } from "../lib/seo/extractAccidentFacts";
import { generateIncidentArticle } from "../lib/seo/generateIncidentArticle";
import { validateIncidentArticle } from "../lib/seo/validateIncidentArticle";

const prisma = new PrismaClient();

// Configuration
const BATCH_SIZE = 15;       // Number of incidents per batch
const MAX_RETRIES = 2;       // Max retries per incident
const DELAY_MS = 1000;       // Delay between incidents (rate limiting)

/**
 * Process a single incident with retry logic.
 */
async function processIncident(
  incident: Awaited<ReturnType<typeof getIncidentsBatch>>[0],
  index: number,
  total: number
): Promise<{ success: boolean; slug: string; qualityStatus: ArticleQualityStatus }> {
  const progress = `[${index + 1}/${total}]`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`${progress} Processing: ${incident.slug} (attempt ${attempt}/${MAX_RETRIES})`);

      // Build combined text from sources for fact extraction
      const combinedText = incident.sources
        .map((s) => `${s.title}. ${s.snippet || ""}`)
        .join("\n\n") || `${incident.headline}. ${incident.summary || ""}`;

      // Extract facts (if not already done)
      let facts: AccidentFacts | null = null;
      if (incident.extractedFacts) {
        facts = incident.extractedFacts as unknown as AccidentFacts;
        console.log(`${progress}   Using existing extracted facts`);
      } else {
        console.log(`${progress}   Extracting facts...`);
        facts = await extractAccidentFacts(incident.headline, combinedText);
      }

      // Generate article (validation is now handled by the generator)
      console.log(`${progress}   Generating 12-section article...`);
      const seoContent = await generateIncidentArticle(
        {
          headline: incident.headline,
          summary: incident.summary,
          city: incident.city,
          state: incident.state,
          occurredAt: incident.occurredAt,
          sources: incident.sources,
        },
        facts
      );

      if (!seoContent) {
        throw new Error("Generator returned null - no content generated");
      }

      // Re-run validation to capture warnings for quality notes
      const validation = validateIncidentArticle(seoContent.articleBody);

      // Determine quality status based on warnings
      let qualityStatus: ArticleQualityStatus = ArticleQualityStatus.OK;
      let qualityNotes: string | null = null;

      if (validation.warnings.length > 0) {
        qualityStatus = ArticleQualityStatus.NEEDS_REVIEW;
        qualityNotes = validation.warnings.join(" | ");
        console.log(`${progress}   Warnings: ${qualityNotes}`);
      }

      // Save to database with quality status
      await prisma.incident.update({
        where: { id: incident.id },
        data: {
          extractedFacts: facts as unknown as Prisma.InputJsonValue,
          seoTitle: seoContent.seoTitle,
          seoDescription: seoContent.seoDescription,
          articleBody: seoContent.articleBody,
          articleQualityStatus: qualityStatus,
          articleQualityNotes: qualityNotes,
        },
      });

      console.log(`${progress} ✓ Saved: ${incident.slug} (${qualityStatus})\n`);
      return { success: true, slug: incident.slug, qualityStatus };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${progress}   Error on attempt ${attempt}: ${message}`);

      if (attempt === MAX_RETRIES) {
        // Mark as FAILED in database
        try {
          await prisma.incident.update({
            where: { id: incident.id },
            data: {
              articleQualityStatus: ArticleQualityStatus.FAILED,
              articleQualityNotes: `Generation failed after ${MAX_RETRIES} retries: ${message}`,
            },
          });
        } catch (updateError) {
          console.error(`${progress}   Failed to update quality status:`, updateError);
        }

        console.error(`${progress} ✗ Marked FAILED: ${incident.slug}\n`);
        return { success: false, slug: incident.slug, qualityStatus: ArticleQualityStatus.FAILED };
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return { success: false, slug: incident.slug, qualityStatus: ArticleQualityStatus.FAILED };
}

/**
 * Get a batch of incidents without articleBody.
 */
async function getIncidentsBatch() {
  return prisma.incident.findMany({
    where: {
      OR: [
        { articleBody: null },
        { articleBody: "" },
      ],
    },
    include: {
      sources: {
        take: 5,
        select: { title: true, snippet: true },
      },
    },
    orderBy: { occurredAt: "desc" },
    take: BATCH_SIZE,
  });
}

/**
 * Main backfill function.
 */
async function main() {
  console.log("========================================");
  console.log("  12-Section Article Backfill Script");
  console.log("========================================");
  console.log(`  Batch size: ${BATCH_SIZE}`);
  console.log(`  Max retries per incident: ${MAX_RETRIES}`);
  console.log("========================================\n");

  // Get batch of incidents
  const incidents = await getIncidentsBatch();

  if (incidents.length === 0) {
    console.log("No incidents found without articleBody. All incidents are up to date!\n");
    return { success: 0, failed: 0, total: 0, updatedSlugs: [] };
  }

  console.log(`Found ${incidents.length} incidents to process in this batch\n`);

  const results = {
    success: 0,
    failed: 0,
    okCount: 0,
    needsReviewCount: 0,
    failedCount: 0,
    updatedSlugs: [] as string[],
    needsReviewSlugs: [] as string[],
    failedSlugs: [] as string[],
  };

  for (let i = 0; i < incidents.length; i++) {
    const result = await processIncident(incidents[i], i, incidents.length);

    if (result.success) {
      results.success++;
      results.updatedSlugs.push(result.slug);
      if (result.qualityStatus === ArticleQualityStatus.OK) {
        results.okCount++;
      } else if (result.qualityStatus === ArticleQualityStatus.NEEDS_REVIEW) {
        results.needsReviewCount++;
        results.needsReviewSlugs.push(result.slug);
      }
    } else {
      results.failed++;
      results.failedCount++;
      results.failedSlugs.push(result.slug);
    }

    // Rate limiting delay
    if (i < incidents.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  // Print summary
  console.log("\n========================================");
  console.log("  Backfill Batch Complete!");
  console.log("========================================");
  console.log(`  Success: ${results.success}`);
  console.log(`  Failed:  ${results.failed}`);
  console.log(`  Total:   ${incidents.length}`);
  console.log("----------------------------------------");
  console.log("  Quality Status Breakdown:");
  console.log(`    OK:           ${results.okCount}`);
  console.log(`    NEEDS_REVIEW: ${results.needsReviewCount}`);
  console.log(`    FAILED:       ${results.failedCount}`);
  console.log("========================================");

  if (results.updatedSlugs.length > 0 && results.needsReviewSlugs.length === 0) {
    console.log("\nAll updated incidents passed validation (OK).");
  }

  if (results.needsReviewSlugs.length > 0) {
    console.log("\nIncidents needing review (warnings):");
    results.needsReviewSlugs.forEach((slug) => console.log(`  - ${slug}`));
  }

  if (results.failedSlugs.length > 0) {
    console.log("\nFailed incidents:");
    results.failedSlugs.forEach((slug) => console.log(`  - ${slug}`));
  }

  // Check remaining
  const remaining = await prisma.incident.count({
    where: {
      OR: [
        { articleBody: null },
        { articleBody: "" },
      ],
    },
  });

  console.log(`\nRemaining incidents without articles: ${remaining}`);
  if (remaining > 0) {
    console.log("Run the script again to process the next batch.\n");
  }

  return { ...results, total: incidents.length };
}

// Run the script
main()
  .catch((e) => {
    console.error("Backfill script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
