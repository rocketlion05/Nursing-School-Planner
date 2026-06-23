# Nursing School Planner

A micro-SaaS tool for pre-nursing students to compare their stats against BSN program requirements in Arkansas and Texas, identify prerequisite gaps, and build an application strategy.

> **Disclaimer:** This tool is for planning purposes only and does NOT guarantee admission. Always verify official requirements with each program.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | API routes + SSR in one repo; trivial Vercel deploy |
| Language | TypeScript | Type-safe scoring logic and DB access |
| Styling | Tailwind CSS v4 | Responsive utility classes, no config needed |
| ORM | Prisma 7 | Type-safe DB access; swap SQLite → Postgres via env var |
| Database | LibSQL/SQLite (dev) | Zero-setup local; Turso for prod |
| Auth | None (MVP) | Profile keyed by UUID cookie; drop in NextAuth later |
| Payments | Stub (access-code) | Pricing UI + code redemption; Stripe ready to wire in |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Copy env file

```bash
cp .env.local.example .env.local
```

The default `DATABASE_URL=file:./dev.db` works out of the box.

### 3. Run migrations and seed

```bash
npm run db:migrate   # creates ./dev.db and tables
npm run db:seed      # seeds 20 programs + 3 test access codes
```

Test access codes: `COMPASS2025`, `NURSING-BETA`, `CYCLE-DEMO`

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
├── app/
│   ├── actions/          # Server Actions (profile, favorites, access-code)
│   ├── layout.tsx        # Root layout with Navbar
│   ├── page.tsx          # Landing page
│   ├── profile/          # Student profile form
│   ├── programs/         # Program list + detail
│   ├── plan/             # Gap analysis & planning
│   └── pricing/          # Pricing & access code redemption
├── components/           # Shared UI components
│   ├── Navbar.tsx
│   ├── Disclaimer.tsx    # Reusable disclaimer banner
│   ├── FitBadge.tsx      # Safe/Match/Reach/Additional Steps Needed badge
│   ├── ProfileForm.tsx   # Interactive profile form (client)
│   ├── ProfileSummary.tsx# Live preview card
│   ├── ProgramList.tsx   # Filterable program list (client)
│   └── AccessCodeForm.tsx
├── lib/
│   ├── constants.ts      # Course list, exam types, disclaimer text
│   ├── prisma.ts         # Prisma client singleton (LibSQL adapter)
│   ├── scoring.ts        # Fit scoring — pure functions, no DB
│   └── gap.ts            # Gap analysis aggregation
├── types/index.ts        # TypeScript types
├── prisma/
│   ├── schema.prisma     # DB schema
│   └── seed.ts           # 20 AR/TX programs + access codes
└── prisma.config.ts      # Prisma 7 config (datasource URL)
```

---

## Fit Scoring Logic

All scoring is deterministic and rule-based — no ML.

**Hard disqualifiers → "Additional Steps Needed":**
- Missing 3+ required prerequisites
- Overall GPA more than 0.5 below the program minimum

**Penalty system (for remaining programs):**
- -2 per missing required course
- -3 if GPA below minimum; -1 if meeting minimum with margin < 0.2
- -2 if science GPA below minimum
- -2 if required exam score below minimum or not taken; -1 if margin < 5%
- -1 if CASPer required but not taken or scored Q1

Penalty total → 0 = Safe, 1–3 = Match, 4+ = Reach

Logic lives in `lib/scoring.ts` — edit the constants at the top to adjust thresholds.

---

## Data Notes

The 20 seeded programs use approximate data for demo purposes. **All requirements must be verified** directly with each program before applying. To update program data:

1. Edit `prisma/seed.ts`
2. Run `npm run db:reset` (⚠️ drops all data) then `npm run db:seed`

Or update programs directly via Prisma Studio: `npm run db:studio`

---

## Future Integrations

### Stripe (Payments)
1. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`
2. Replace the disabled "Pay Now" button in `app/pricing/page.tsx` with a Stripe Checkout call
3. Add webhook handler at `app/api/stripe-webhook/route.ts` to flip `profile.tier = 'cycle'` on `checkout.session.completed`
4. The access code system can remain as a promotional code path

### AI Guidance (Claude API)
1. The scoring engine already returns structured gap data (`FitResult`, `GapSummary`)
2. Wrap `computeGapSummary()` output in a prompt and call the Claude API
3. Stream response via `app/api/ai-plan/route.ts` using SSE or React `use()`
4. Gate behind `profile.tier === 'cycle'`

### Auth (NextAuth)
1. `npm install next-auth`
2. Add `AUTH_SECRET` to env
3. The Profile table already has `email` — link it to the NextAuth session user
4. Replace the UUID-cookie lookup in `app/actions/profile.ts` with `auth().session.user.id`

### Real Program Data
Program data is approximate. To add real data:
1. Update `prisma/seed.ts` with verified requirements from each school's website
2. Or build an admin UI (Prisma Studio works well for this)
3. Future: pull from a nursing school API or NCSBN data

---

## Deployment (Vercel + Turso)

1. Create a Turso database: `turso db create nursing-school-planner`
2. Get the connection URL and auth token from Turso
3. Set env vars in Vercel: `DATABASE_URL=libsql://...` and `DATABASE_AUTH_TOKEN=...`
4. Update `prisma.config.ts` to use `process.env.DATABASE_AUTH_TOKEN`
5. Update `lib/prisma.ts` to pass `authToken` to `PrismaLibSql`
6. Deploy: `vercel --prod`
