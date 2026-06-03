# School-research routine (set up later)

This is the scaffolding for a scheduled AI agent (e.g. a Claude Code routine) that
keeps the program database current. It does two jobs:

1. **Fulfill school requests** — research each pending `SchoolRequest`, add the program,
   mark the request resolved.
2. **Fill in missing requirements** — for existing programs that still have NULL
   GPA / exam / prereq data, research and fill them in.

Nothing here runs automatically yet — wire it into a schedule when you're ready
(see "Scheduling it" below).

## How the pieces fit

- **Source of truth for programs:** [`prisma/programs-data.ts`](../prisma/programs-data.ts).
  The agent edits entries here (or appends new ones), then runs the seed to push to the
  live DB. Seeding is idempotent (upsert by `slug`), so editing an entry updates that
  one program; adding an entry creates a new one.
- **Requests inbox:** the `SchoolRequest` table, read/updated via the scripts below.
- **Prod credentials:** the scripts read `DATABASE_URL` + `DATABASE_AUTH_TOKEN`. Keep them
  in the gitignored `.env.production.local`, or export them in the routine's shell.

## Commands the routine uses

```bash
# 1. See what users have requested (JSON on stdout)
npx tsx scripts/list-school-requests.ts          # pending only

# 2. (agent edits prisma/programs-data.ts — fills requirements / appends new schools)

# 3. Push the edits to the live DB
npx tsx prisma/seed.ts                            # upsert by slug; prints a summary

# 4. Mark each handled request resolved
npx tsx scripts/resolve-request.ts <id> --fulfilled --note "Added as slug <slug>"
npx tsx scripts/resolve-request.ts <id> --rejected  --note "Not a BSN program"
```

> First time on a fresh machine/DB, apply migrations: `npx tsx scripts/deploy-db.ts`
> (it tracks applied migrations, so it's safe to re-run).

## Data rules (so the agent writes valid records)

- `slug`: `"<state>-<university>-<city>"` lowercased, non-alphanumeric → `-` (must be unique).
- `region`: `"Arkansas"` | `"Texas"` | `"National"`. `tier`: `"Local"` | `"Top TX"` | `"Top US"`.
- `requiredCourses`: array of course **keys**, not labels:
  `ANAT_PHYS_1, ANAT_PHYS_2, MICRO, CHEM, STATS, NUTRITION, LIFESPAN, ENGLISH_COMP`.
- `examType`: `"TEAS"` | `"HESI A2"` | `"NLN PAX"` | `null`. `minExamScore`: percent 0–100.
- `minOverallGPA` / `minScienceGPA`: 0.0–4.0, or `null` if you can't verify it.
- **Never guess.** Leave a field `null` rather than inventing it, and cite the source in `notes`.

## Ready-to-use routine prompt

Paste this as the routine's instruction (adjust the batch size to taste):

```
You maintain the Nursing School Planner program database. Working dir is the
pre-nursing-compass project. Prod DB creds are in .env.production.local.

1. Run `npx tsx scripts/list-school-requests.ts` to get pending school requests.
2. For each request: research the program on the official school site. If it's a real
   BSN program, add an entry to prisma/programs-data.ts following the field rules in
   docs/AGENT_ROUTINE.md (verified data only; null where unsure; cite source in notes).
   If it's not a valid BSN program, skip adding it.
3. Then pick up to 5 existing programs in programs-data.ts that have minOverallGPA: null
   and research + fill their requirements from the official site (GPA, examType,
   minExamScore, requiredCourses, deadlines). Only use verified data.
4. Run `npx tsx prisma/seed.ts` to push all edits to the live DB and confirm the summary.
5. For each request you handled, run `npx tsx scripts/resolve-request.ts <id>
   --fulfilled --note "..."` (or --rejected with a reason).
6. Summarize what you added, updated, and rejected.

Make a git commit of the programs-data.ts changes, but do NOT push unless explicitly
told to. Do not invent requirements — leave fields null when unverified.
```

## Scheduling it (when ready)

Use the `/schedule` command in Claude Code to create a recurring remote agent (cron),
or `/loop` for a self-paced run. Point it at the prompt above. Start with a manual
one-off run to confirm it behaves before putting it on a schedule.
