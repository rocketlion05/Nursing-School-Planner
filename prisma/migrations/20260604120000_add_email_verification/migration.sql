-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerified" DATETIME;

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_tokenHash_key" ON "VerificationToken"("tokenHash");

-- Backfill: existing accounts predate email verification, so grandfather them in
-- (mark verified) to avoid locking anyone out of login.
UPDATE "User" SET "emailVerified" = "createdAt" WHERE "emailVerified" IS NULL;
