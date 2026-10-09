-- CreateEnum
CREATE TYPE "ArticleQualityStatus" AS ENUM ('OK', 'NEEDS_REVIEW', 'FAILED');

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "summary" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "articleBody" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "articleQualityStatus" "ArticleQualityStatus" DEFAULT 'OK',
    "articleQualityNotes" TEXT,
    "extractedFacts" JSONB,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentSource" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT,
    "snippet" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Incident_slug_key" ON "Incident"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_dedupeKey_key" ON "Incident"("dedupeKey");

-- CreateIndex
CREATE INDEX "Incident_occurredAt_idx" ON "Incident"("occurredAt");

-- CreateIndex
CREATE INDEX "Incident_city_state_idx" ON "Incident"("city", "state");

-- CreateIndex
CREATE INDEX "Incident_createdAt_idx" ON "Incident"("createdAt");

-- CreateIndex
CREATE INDEX "IncidentSource_incidentId_idx" ON "IncidentSource"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentSource_publishedAt_idx" ON "IncidentSource"("publishedAt");

-- AddForeignKey
ALTER TABLE "IncidentSource" ADD CONSTRAINT "IncidentSource_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

