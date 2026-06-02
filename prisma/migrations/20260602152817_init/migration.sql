-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "programType" TEXT NOT NULL DEFAULT 'Traditional BSN',
    "minOverallGPA" REAL,
    "minScienceGPA" REAL,
    "requiredCourses" TEXT NOT NULL DEFAULT '[]',
    "examType" TEXT,
    "minExamScore" REAL,
    "casperRequired" BOOLEAN NOT NULL DEFAULT false,
    "deadlines" TEXT,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccessCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "usedBy" TEXT,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_profileId_programId_key" ON "Favorite"("profileId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessCode_code_key" ON "AccessCode"("code");
