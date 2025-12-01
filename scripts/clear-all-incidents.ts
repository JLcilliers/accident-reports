import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearAllIncidents() {
  console.log("Clearing ALL incidents from database...");
  console.log("(IncidentSources will be deleted via cascade)");

  // First count how many we're deleting
  const count = await prisma.incident.count();
  console.log(`Found ${count} incidents to delete.`);

  if (count === 0) {
    console.log("No incidents to delete.");
    await prisma.$disconnect();
    return;
  }

  // Delete all incidents (sources cascade)
  const result = await prisma.incident.deleteMany({});
  console.log(`Deleted ${result.count} incidents.`);

  // Verify
  const remaining = await prisma.incident.count();
  const remainingSources = await prisma.incidentSource.count();
  console.log(`Remaining incidents: ${remaining}`);
  console.log(`Remaining sources: ${remainingSources}`);

  await prisma.$disconnect();
}

clearAllIncidents().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
