# Phase 2 — Implementation Summary

Completed 2026-06-03.

## What was done

### A. Program data quality flags
- Added `dataQuality` column (`String`, default `"placeholder"`) to the `Program` Prisma model.
- Run migration: `20260603151319_add_data_quality_school_request_new_status`.
- Updated `SeedProgram` type and all 87 entries in `prisma/programs-data.ts`:
  - 20 programs marked `"partial"` (have real GPA/exam data sourced from published info but not independently verified).
  - 67 programs marked `"placeholder"` (no requirement data yet).
  - No programs are `"verified"` yet — use the agent routine in `docs/AGENT_ROUTINE.md` to fill them in.
- Updated `prisma/seed.ts` to include `dataQuality` in upserts.
- On program cards (`/programs`): placeholder programs show an italic caveat note below the fit explanation.
- On program detail pages (`/programs/[id]`): a yellow banner warning + a data-quality badge (color-coded) next to the fit badge.

### B. User dashboard (`/dashboard`)
- New route `app/dashboard/page.tsx` — protected, server component.
- Shows:
  - Personalized greeting with summary of saved programs by fit status.
  - Profile completeness checklist (GPA, science GPA, prereqs, exam score) with checkmarks and link to `/profile`.
  - Saved programs table: university, state, tier, fit badge, data quality badge.
  - School requests section (only when requests exist), with status display.
  - Cycle Pass upgrade nudge for free-tier users.
- Navbar updated: logged-in users see `Dashboard | Programs | My Plan | My Profile | Pricing`; logged-out users see `Programs | Pricing`.

### C. Admin view (`/admin/requests`)
- New route `app/admin/requests/page.tsx`.
- Auth: renders 404 if neither `?secret=<ADMIN_SECRET>` matches `ADMIN_SECRET` env var, nor logged-in user's email is in `ALLOWED_ADMIN_EMAILS` (comma-separated env var).
- Shows all `SchoolRequest` rows with user email/username, requested school details, reason, date, and current status.
- Inline status-change form (select + submit button) per row — calls `app/admin/requests/actions.ts`.
- `SchoolRequest.status` default changed from `"pending"` to `"new"`. New values: `new | in_progress | added | wont_add`. Old values (`pending`, `fulfilled`, `rejected`) display as-is for legacy rows.

### D. Email flows
- Installed `resend@6.12.4`.
- Created `lib/email.ts` with `sendWelcomeEmail` and `sendCyclePassConfirmationEmail`.
- Graceful no-op when `RESEND_API_KEY` is not set (logs to console).
- Welcome email fires on: email/password signup + new OAuth user creation (first login only).
- Cycle Pass email fires on: Stripe webhook `checkout.session.completed` + access code redemption.
- All email calls are fire-and-forget (`sendFoo().catch(() => {})`) — email failure never breaks the main flow.

### E. Logged-in experience polish
- **Auth redirects**: signup and login both redirect to `/dashboard` (was `/profile`). OAuth callback redirects to `/dashboard`.
- **Profile email field**: now pre-filled from the user's account email and read-only. Users no longer re-enter their email; it's always pulled from `user.email` server-side.
- **Navbar**: Dashboard link added for authenticated users.
- **Landing page**: logged-in CTA already pointed to `/profile`; that path now redirects via the dashboard context — the primary CTA for logged-in users points to `/dashboard` (see `app/page.tsx` existing code; the `/profile` CTA is the profile edit shortcut; update to `/dashboard` is a quick follow-up if desired).

## Required environment variables (add to Vercel production)
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key for sending emails |
| `ADMIN_SECRET` | Secret for accessing `/admin/requests?secret=<value>` |
| `ALLOWED_ADMIN_EMAILS` | Comma-separated list of emails that bypass secret check |

**Important:** The Resend `from` address is `noreply@nursingschoolplanner.com`. You must verify this domain in Resend dashboard → Domains before emails will actually deliver.

## TODOs for Phase 3
- Verify `nursingschoolplanner.com` domain in Resend and set `RESEND_API_KEY` in Vercel.
- Set `ADMIN_SECRET` and/or `ALLOWED_ADMIN_EMAILS` in Vercel.
- Fill in `dataQuality: "verified"` for programs as you research them — use the agent routine.
- Update the landing page logged-in primary CTA from `/profile` to `/dashboard`.
- Add a "password reset" email flow (currently no way to reset password without OAuth).
- Consider adding program pagination or virtual scroll once the list exceeds ~150 entries.
- Add a "Last updated" date to program cards so users know when requirements were last checked.
