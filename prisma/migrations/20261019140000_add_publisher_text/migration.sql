-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "articleTextTriedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "IncidentSource" ADD COLUMN     "publisherDomain" TEXT;
