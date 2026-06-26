-- One row per purchased Cycle Pass. expiryDate is computed once at purchase
-- (purchase + 180 days) and is immutable thereafter. stripeSessionId is unique
-- for idempotent webhook / success-page writes.
CREATE TABLE "CyclePass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "purchaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CyclePass_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "CyclePass_stripeSessionId_key" ON "CyclePass"("stripeSessionId");
CREATE INDEX "CyclePass_profileId_idx" ON "CyclePass"("profileId");
