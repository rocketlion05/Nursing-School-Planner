-- The nursing program's admissions contact email, shown so students can reach the
-- school directly. Filled from official pages by the research agents; nullable.
ALTER TABLE "Program" ADD COLUMN "admissionEmail" TEXT;
