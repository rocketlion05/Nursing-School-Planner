# School-maintenance routine

Scheduled agent that keeps the Nursing School Planner program database accurate and
current. It runs every 3 days (scheduled task `school-maintenance`) and does three jobs:

1. **Fulfill new school requests** — research each pending `SchoolRequest` on the school's
   official site, add the program if it's a real BSN, and resolve the request.
2. **Re-verify a rotating batch** of existing schools against official sources, correcting
   anything that changed. Over successive runs the rotation covers all 87 programs.
3. **Ship it live** — seed the prod Turso DB and push to GitHub (triggers a Vercel redeploy).

## How the pieces fit

- **Source of truth for programs:** [`prisma/programs-data.ts`](../prisma/programs-data.ts).
  The agent edits/append entries here, then runs the seed (idempotent upsert by `slug`).
- **Live data:** lives in the Turso prod DB. Editing `programs-data.ts` does NOT change the
  live site until `prisma/seed.ts --prod` runs. A git push alone only redeploys code.
- **Requests inbox:** the `SchoolRequest` table.
- **Rotation state:** [`prisma/verification-log.json`](../prisma/verification-log.json) maps
  `slug -> ISO timestamp` of last re-verification. `verify-queue.ts` reads it to pick the
  least-recently-checked batch; `mark-verified.ts` bumps it. Commit it so rotation persists.
- **Prod credentials:** gitignored `.env.production.local` (DATABASE_URL=libsql://… +
  DATABASE_AUTH_TOKEN). The `--prod` flag on the DB scripts loads it; without `--prod` they
  use `.env` (local `dev.db`).

## Commands

```bash
# Read live requests (new + in_progress)
npx tsx scripts/list-school-requests.ts --prod

# Pick the next rotating re-verify batch (no DB; reads the log). Default 12.
npx tsx scripts/verify-queue.ts            # or: verify-queue.ts 15

# (agent edits prisma/programs-data.ts — fills/corrects requirements, appends new schools)

# Record which schools were re-checked this run (every slug in the batch, changed or not)
npx tsx scripts/mark-verified.ts <slug> <slug> ...

# Push edits to the LIVE DB (prints the target so you can confirm it says REMOTE/PROD)
npx tsx prisma/seed.ts --prod

# Resolve each handled request (status must be added | wont_add)
npx tsx scripts/resolve-request.ts <id> --added    --note "Added as <slug>"
npx tsx scripts/resolve-request.ts <id> --wont-add --note "Not a BSN program"
```

> First run on a fresh DB only: `npx tsx scripts/deploy-db.ts --prod` (idempotent migrations).

## Data rules (so the agent writes valid, trustworthy records)

- **Official sources only.** Use the school's own `.edu` nursing/admission page or official
  catalog for requirement VALUES. Ignore aggregators (US News, Niche, CampusReel, Cappex,
  nursing directories) for numbers — they're often wrong or stale.
- **Never invent a value.** Leave a field `null` if the official page doesn't state it.
- **Never downgrade on a weak signal.** If a field is already populated and you can't find a
  clearly-authoritative contradicting value on the official page, LEAVE IT UNCHANGED.
- **Right program track.** Only the TRADITIONAL / pre-licensure BSN. Do not mix in accelerated
  (ABSN), RN-to-BSN, or second-degree requirements.
- `slug`: `"<state>-<university>-<city>"` lowercased, non-alphanumeric → `-` (unique).
- `region`: `Arkansas` | `Texas` | `National`. `tier`: `Local` | `Top TX` | `Top US`.
- `isPublic`: `false` for private / religious / for-profit schools, else `true`.
- `requiredCourses`: array of course **keys**, not labels:
  `ANAT_PHYS_1, ANAT_PHYS_2, MICRO, CHEM, STATS, NUTRITION, LIFESPAN, ENGLISH_COMP`.
- `examType`: `TEAS` | `HESI A2` | `NLN PAX` | `null`. `minExamScore`: percent 0–100.
- `minOverallGPA` / `minScienceGPA`: 0.0–4.0, or `null` if unverified.
- `dataQuality`: `verified` only when every populated requirement came from the official page;
  `partial` if sourced but incomplete; `placeholder` if no requirement data. Cite source +
  date in `notes`. Programs with no requirement signals correctly score "Unverified" in-app.

## The routine prompt

The live prompt is stored in the scheduled task at
`C:\Users\nwcon\.claude\scheduled-tasks\school-maintenance\SKILL.md`. Keep this doc and that
prompt in sync. To change cadence or behavior, edit the task with
`mcp__scheduled-tasks__update_scheduled_task` (or `/schedule`).
