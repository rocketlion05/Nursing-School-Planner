-- Email capture for free lead-magnet downloads (marketing list).
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "magnet" TEXT NOT NULL DEFAULT 'bsn-prerequisite-checklist',
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Lead_email_magnet_key" ON "Lead"("email", "magnet");
