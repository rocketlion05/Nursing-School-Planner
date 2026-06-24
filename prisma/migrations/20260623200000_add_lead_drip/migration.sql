-- Track nurture-drip progress per captured lead.
ALTER TABLE "Lead" ADD COLUMN "dripStage" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Lead" ADD COLUMN "lastDripAt" DATETIME;
