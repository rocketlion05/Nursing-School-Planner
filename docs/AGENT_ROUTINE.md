# Automated maintenance routines

Three scheduled agents keep the Nursing School Planner accurate and growing. They
run LOCALLY (only while the Claude Code app is open / on next launch) because prod
credentials (`.env.production.local`) and `gh`/git auth are local-only.

| Task | Schedule | Job |
|------|----------|-----|
| `nursing-arkansas-research` | Weekly, Mon ~9:20am | Research & verify every **Arkansas** BSN program from official sources; fill requirements + `officialUrl`; fulfill AR school requests; seed prod; push. |
| `nursing-texas-research` | Weekly, Wed ~9:20am | Same for **Texas** (~58 schools) on a rotating batch (~15–20/run) so all cycle over ~3 weeks. |
| `nursing-oklahoma-research` | Weekly, Tue ~9:20am | **Populate + verify Oklahoma** BSN programs from scratch (~8–12/run) until the state is covered, then maintain. |
| `nursing-louisiana-research` | Weekly, Thu ~9:20am | Same for **Louisiana**. |
| `nursing-seo-content` | Weekly, Fri ~9:00am | Publish 1–2 new SEO guide articles (`content/guides/*.md`) + strengthen internal linking; push. |

> The old combined `school-maintenance` task (every 3 days) is **retired/disabled** — its
> per-state research work is now split across the two state agents, and content/SEO is its
> own routine. Re-enable it only if you want to roll back.

**Adding another state:** copy the `nursing-oklahoma-research` SKILL (it has the
populate-from-scratch phase), change the state name + two-letter code + slug prefix + Board of
Nursing source + cron day, and create it via `mcp__scheduled-tasks__create_scheduled_task` (or
`/schedule`). Two things to remember:
- New-state programs MUST set `region: "National"` — the `region` union in `programs-data.ts`
  only has `Arkansas | Texas | National`, so any other value fails the TypeScript build. (The
  public-facing grouping that matters is `state`, not `region`.)
- The state hub (`/nursing-programs/<state>`), its city pages (`/nursing-programs/<state>/<city>`),
  the chance calculator, and sitemap entries all appear automatically once that state has
  programs in the DB — they're generated from `prisma/program.state`. You only add program rows.

## How the pieces fit

- **Source of truth for programs:** [`prisma/programs-data.ts`](../prisma/programs-data.ts).
  Agents edit/append entries, then run the seed (idempotent upsert by `slug`).
- **Live data:** lives in the Turso prod DB. Editing `programs-data.ts` does NOT change the
  live site until `prisma/seed.ts --prod` runs. A git push alone only redeploys code.
- **Pretty URLs:** `urlSlug` (e.g. `arkansas-state-university`) is **computed by the seed**
  from the university name (collision-safe; see [`lib/slug.ts`](../lib/slug.ts)). Do NOT set
  it by hand in `programs-data.ts`. Old `/programs/<cuid>` URLs 308-redirect to the slug.
- **Official links:** `officialUrl` on each program is the school's official admissions /
  requirements page, surfaced as a button on the program page and the state hubs.
- **Guides:** markdown files in [`content/guides/`](../content/guides) with a `title` /
  `description` / `date` frontmatter block. New files appear at `/guides/<filename>` and in
  the sitemap on the next deploy — no DB involved.
- **Requests inbox:** the `SchoolRequest` table (`scripts/list-school-requests.ts --prod`).
- **Prod credentials:** gitignored `.env.production.local`. The `--prod` flag on the DB
  scripts loads it; without `--prod` they use `.env` (local `dev.db`).

## Commands

```bash
npx tsx scripts/list-school-requests.ts --prod          # read live requests
# (agent edits prisma/programs-data.ts — requirements, officialUrl, new schools)
npx tsx prisma/seed.ts --prod                            # push to LIVE DB (prints REMOTE/PROD)
npx tsx scripts/resolve-request.ts <id> --added    --note "Added as <slug>" --prod
npx tsx scripts/resolve-request.ts <id> --wont-add --note "Not a BSN program" --prod
npx tsx scripts/make-favicon.ts                          # regenerate the white-circle favicons
```

> First run on a fresh DB only: `npx tsx scripts/deploy-db.ts --prod` (idempotent migrations).

## Data rules (so agents write valid, trustworthy records)

- **Official sources only.** The school's own `.edu` nursing/admissions page or official
  catalog for VALUES. Ignore aggregators (US News, Niche, CampusReel, Cappex, directories).
- **Never invent a value.** Leave a field `null` if the official page doesn't state it. For
  `officialUrl`, only use a URL you confirmed loads; otherwise leave it null — never guess.
- **Never downgrade on a weak signal.** If a field is populated and you can't find a clearly
  authoritative contradicting value, LEAVE IT UNCHANGED.
- **Right program track.** Only the TRADITIONAL / pre-licensure BSN. No ABSN / RN-to-BSN /
  second-degree requirements.
- `region`: `Arkansas` | `Texas` | `National`. `tier`: `Local` | `Top TX` | `Top US`.
- `isPublic`: `false` for private / religious / for-profit, else `true`.
- `requiredCourses`: course **keys** — `ANAT_PHYS_1, ANAT_PHYS_2, MICRO, CHEM, STATS,
  NUTRITION, LIFESPAN, ENGLISH_COMP`.
- `examType`: `TEAS` | `HESI A2` | `NLN PAX` | `null`. `minExamScore`: percent 0–100.
- `minOverallGPA` / `minScienceGPA`: 0.0–4.0, or `null` if unverified.
- `dataQuality`: `verified` only when every populated requirement came from the official page;
  `partial` if sourced but incomplete; `placeholder` if no requirement data.
- `estimatedFields`: when you confirm a field's real value, set it and REMOVE that field from
  `estimatedFields` (delete the property when empty). Don't invent new estimates.
- Cite source + date in `notes`.

## Verification dates ("Verified <date>" on each program)

Each program page shows when its data was last reviewed against official sources. This is NOT a
column in `programs-data.ts` / the DB — it lives in `prisma/verification-log.json` (`slug` -> ISO
timestamp), read at build time by `lib/programs.ts` + the program detail page.

Every state research run must stamp it: after applying verified edits, run
`npx tsx scripts/mark-verified.ts <slug> [<slug> ...]` for **every school checked against official
sources this run** (changed or not). That bumps each slug's timestamp to today; `git add -A` + push
commits the log, and the next deploy surfaces the new "Verified <date>". Only stamp schools you
actually re-checked — the date must mean "last reviewed against official sources," never a guess.
(`scripts/verify-queue.ts` reads the same log to rank least-recently-verified schools first.)

## The routine prompts

The live prompts are stored in each task's `SKILL.md` under
`C:\Users\nwcon\.claude\scheduled-tasks\<task-id>\SKILL.md`. Keep this doc and those prompts
in sync. To change cadence/behavior, edit with `mcp__scheduled-tasks__update_scheduled_task`
(or `/schedule`). Tip: click **Run now** on each task once in the Scheduled sidebar to
pre-approve the tools it uses (git, `npx tsx`, web fetch, subagents) so future headless runs
don't stall on a permission prompt.
