import { PrismaClient, Prisma } from "@prisma/client";
import { extractAccidentFacts, type AccidentFacts } from "../lib/seo/extractAccidentFacts";
import { generateIncidentArticle } from "../lib/seo/generateIncidentArticle";

const prisma = new PrismaClient();

async function regenerateArticles() {
  console.log("Starting article regeneration for all incidents...\n");

  // Find all incidents that need article generation
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
  });

  console.log(`Found ${incidents.length} incidents to process\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < incidents.length; i++) {
    const incident = incidents[i];
    const progress = `[${i + 1}/${incidents.length}]`;

    try {
      // Build combined text from sources
      const combinedText = incident.sources
        .map((s) => `${s.title}. ${s.snippet || ""}`)
        .join("\n\n") || `${incident.headline}. ${incident.summary || ""}`;

      // Extract facts
      console.log(`${progress} Extracting facts for: ${incident.slug}`);
      const facts = await extractAccidentFacts(incident.headline, combinedText);

      // Generate article
      console.log(`${progress} Generating article for: ${incident.slug}`);
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

      if (seoContent) {
        await prisma.incident.update({
          where: { id: incident.id },
          data: {
            extractedFacts: facts as unknown as Prisma.InputJsonValue,
            seoTitle: seoContent.seoTitle,
            seoDescription: seoContent.seoDescription,
            articleBody: seoContent.articleBody,
          },
        });
        console.log(`${progress} ✓ Updated: ${incident.slug}\n`);
        success++;
      } else {
        console.log(`${progress} ✗ No content generated for: ${incident.slug}\n`);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${progress} ✗ Error for ${incident.slug}: ${message}\n`);
      failed++;
    }
  }

  console.log("\n========================================");
  console.log(`Regeneration complete!`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${incidents.length}`);
  console.log("========================================\n");

  await prisma.$disconnect();
}

regenerateArticles().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
