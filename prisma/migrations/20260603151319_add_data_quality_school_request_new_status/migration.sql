-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT '',
    "tier" TEXT NOT NULL DEFAULT 'Local',
    "isFlagship" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "programType" TEXT NOT NULL DEFAULT 'Traditional BSN',
    "minOverallGPA" REAL,
    "minScienceGPA" REAL,
    "requiredCourses" TEXT NOT NULL DEFAULT '[]',
    "examType" TEXT,
    "minExamScore" REAL,
    "casperRequired" BOOLEAN NOT NULL DEFAULT false,
    "deadlines" TEXT,
    "notes" TEXT,
    "dataQuality" TEXT NOT NULL DEFAULT 'placeholder'
);
INSERT INTO "new_Program" ("casperRequired", "city", "deadlines", "examType", "id", "isFlagship", "isPublic", "minExamScore", "minOverallGPA", "minScienceGPA", "name", "notes", "programType", "region", "requiredCourses", "slug", "state", "tier", "university") SELECT "casperRequired", "city", "deadlines", "examType", "id", "isFlagship", "isPublic", "minExamScore", "minOverallGPA", "minScienceGPA", "name", "notes", "programType", "region", "requiredCourses", "slug", "state", "tier", "university" FROM "Program";
DROP TABLE "Program";
ALTER TABLE "new_Program" RENAME TO "Program";
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");
CREATE TABLE "new_SchoolRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolName" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "programType" TEXT NOT NULL DEFAULT 'BSN',
    "reason" TEXT,
    "requestedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "resolution" TEXT,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SchoolRequest" ("city", "createdAt", "id", "programType", "reason", "requestedBy", "resolution", "resolvedAt", "schoolName", "state", "status", "university") SELECT "city", "createdAt", "id", "programType", "reason", "requestedBy", "resolution", "resolvedAt", "schoolName", "state", "status", "university" FROM "SchoolRequest";
DROP TABLE "SchoolRequest";
ALTER TABLE "new_SchoolRequest" RENAME TO "SchoolRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
