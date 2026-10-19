-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "articleAttemptedAt" TIMESTAMP(3),
ADD COLUMN     "articleAttempts" INTEGER DEFAULT 0;

