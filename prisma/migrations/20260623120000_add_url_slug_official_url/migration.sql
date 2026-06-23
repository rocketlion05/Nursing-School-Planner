-- Pretty SEO URL key (e.g. "arkansas-state-university") and the school's
-- official admissions page link. Both nullable; `urlSlug` is unique.
ALTER TABLE "Program" ADD COLUMN "urlSlug" TEXT;
ALTER TABLE "Program" ADD COLUMN "officialUrl" TEXT;
CREATE UNIQUE INDEX "Program_urlSlug_key" ON "Program"("urlSlug");
