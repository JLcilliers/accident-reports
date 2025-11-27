import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function clearArticles() {
  console.log("Clearing all article content from incidents...");

  const result = await prisma.incident.updateMany({
    data: {
      articleBody: null,
      seoTitle: null,
      seoDescription: null,
      extractedFacts: Prisma.DbNull,
    },
  });

  console.log(`Cleared article content from ${result.count} incidents.`);

  await prisma.$disconnect();
}

clearArticles().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
