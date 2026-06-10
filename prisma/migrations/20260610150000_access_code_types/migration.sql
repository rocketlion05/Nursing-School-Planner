-- Typed, multi-use access codes: 'month' (30 days) or 'lifetime', each
-- redeemable up to maxUses times by distinct profiles.
ALTER TABLE "AccessCode" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'month';
ALTER TABLE "AccessCode" ADD COLUMN "maxUses" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "AccessCode" ADD COLUMN "usedCount" INTEGER NOT NULL DEFAULT 0;

-- Per-profile redemption tracking (a single usedBy column can't represent
-- multi-use codes; unique constraint blocks double-redemption per profile).
CREATE TABLE "AccessCodeRedemption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "redeemedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessCodeRedemption_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "AccessCode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "AccessCodeRedemption_codeId_profileId_key" ON "AccessCodeRedemption"("codeId", "profileId");

-- Backfill legacy single-use redemptions into the new shape.
UPDATE "AccessCode" SET "usedCount" = 1 WHERE "usedBy" IS NOT NULL;

INSERT INTO "AccessCodeRedemption" ("id", "codeId", "profileId", "redeemedAt")
SELECT 'acr_' || lower(hex(randomblob(12))), "id", "usedBy", COALESCE("usedAt", CURRENT_TIMESTAMP)
FROM "AccessCode"
WHERE "usedBy" IS NOT NULL;
