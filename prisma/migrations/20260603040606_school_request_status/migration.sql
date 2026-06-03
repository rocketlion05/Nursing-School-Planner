-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SchoolRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolName" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "programType" TEXT NOT NULL DEFAULT 'BSN',
    "reason" TEXT,
    "requestedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "resolution" TEXT,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SchoolRequest" ("city", "createdAt", "id", "programType", "reason", "requestedBy", "schoolName", "state", "university") SELECT "city", "createdAt", "id", "programType", "reason", "requestedBy", "schoolName", "state", "university" FROM "SchoolRequest";
DROP TABLE "SchoolRequest";
ALTER TABLE "new_SchoolRequest" RENAME TO "SchoolRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
