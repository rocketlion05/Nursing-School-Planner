-- Crowdsourced self-reported admission outcomes per program.
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "overallGPA" REAL,
    "scienceGPA" REAL,
    "examType" TEXT,
    "examScore" REAL,
    "cycleYear" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Outcome_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Outcome_programId_idx" ON "Outcome"("programId");
