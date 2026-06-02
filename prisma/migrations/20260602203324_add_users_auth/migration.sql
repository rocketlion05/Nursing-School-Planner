-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OAuthAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OAuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "statePrefs" TEXT NOT NULL DEFAULT '[]',
    "targetTerm" TEXT NOT NULL DEFAULT '',
    "overallGPA" REAL,
    "scienceGPA" REAL,
    "totalCredits" INTEGER,
    "coursesCompleted" TEXT NOT NULL DEFAULT '[]',
    "teasScore" REAL,
    "hesiScore" REAL,
    "casperQuartile" INTEGER,
    "casperPercentile" INTEGER,
    "otherExamName" TEXT,
    "otherExamScore" REAL,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("casperPercentile", "casperQuartile", "coursesCompleted", "createdAt", "email", "hesiScore", "id", "name", "otherExamName", "otherExamScore", "overallGPA", "scienceGPA", "statePrefs", "targetTerm", "teasScore", "tier", "totalCredits", "updatedAt") SELECT "casperPercentile", "casperQuartile", "coursesCompleted", "createdAt", "email", "hesiScore", "id", "name", "otherExamName", "otherExamScore", "overallGPA", "scienceGPA", "statePrefs", "targetTerm", "teasScore", "tier", "totalCredits", "updatedAt" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_provider_providerAccountId_key" ON "OAuthAccount"("provider", "providerAccountId");
