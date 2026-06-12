-- Throttled activity stamp for admin active-user stats.
ALTER TABLE "User" ADD COLUMN "lastActiveAt" DATETIME;
