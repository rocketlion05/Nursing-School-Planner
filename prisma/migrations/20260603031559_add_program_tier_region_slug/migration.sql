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
    "notes" TEXT
);
INSERT INTO "new_Program" ("casperRequired", "city", "deadlines", "examType", "id", "isPublic", "minExamScore", "minOverallGPA", "minScienceGPA", "name", "notes", "programType", "requiredCourses", "state", "university") SELECT "casperRequired", "city", "deadlines", "examType", "id", "isPublic", "minExamScore", "minOverallGPA", "minScienceGPA", "name", "notes", "programType", "requiredCourses", "state", "university" FROM "Program";
DROP TABLE "Program";
ALTER TABLE "new_Program" RENAME TO "Program";
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
