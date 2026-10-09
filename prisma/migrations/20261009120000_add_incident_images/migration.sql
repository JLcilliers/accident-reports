-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('NONE', 'OK', 'FAILED');

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "imageAlt" TEXT,
ADD COLUMN     "imageAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageCostUsd" DECIMAL(10,6),
ADD COLUMN     "imageGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "imageModel" TEXT,
ADD COLUMN     "imageStatus" "ImageStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE INDEX "Incident_imageStatus_createdAt_idx" ON "Incident"("imageStatus", "createdAt");

