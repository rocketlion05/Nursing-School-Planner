/**
 * Picks the next rotating batch of schools for the maintenance routine to re-verify,
 * so that ALL programs get re-checked over time instead of the same few every run.
 *
 *   npx tsx scripts/verify-queue.ts            # default batch of 12 (JSON on stdout)
 *   npx tsx scripts/verify-queue.ts 20         # custom batch size
 *   npx tsx scripts/verify-queue.ts TX         # only Texas schools (default batch)
 *   npx tsx scripts/verify-queue.ts 30 TX      # 30 Texas schools
 *
 * Args are order-independent: a number sets the batch size, a 2-letter code filters
 * by state. Ordering: schools never verified (no "Verified" date yet) come FIRST, then
 * the least-recently-verified, based on prisma/verification-log.json (slug -> ISO
 * timestamp). This is how undated schools get surfaced and filled in. After re-verifying
 * a batch, the routine calls `scripts/mark-verified.ts <slug...>` to bump their timestamps.
 *
 * Reads only programs-data.ts + the log file — no DB connection, so it's safe and fast.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SEED_PROGRAMS } from '../prisma/programs-data'

const LOG_PATH = join(process.cwd(), 'prisma', 'verification-log.json')

function loadLog(): Record<string, string> {
  try {
    const raw = JSON.parse(readFileSync(LOG_PATH, 'utf8'))
    return raw && typeof raw === 'object' ? raw : {}
  } catch {
    return {}
  }
}

function main() {
  // Order-independent args: a number = batch size, a 2-letter token = state code.
  const args = process.argv.slice(2)
  const batchSize = Number(args.find(a => /^\d+$/.test(a))) || 12
  const state = args.find(a => /^[A-Za-z]{2}$/.test(a))?.toUpperCase()

  const log = loadLog()

  const pool = state ? SEED_PROGRAMS.filter(p => p.state === state) : SEED_PROGRAMS
  const ranked = pool
    .map(p => ({
      slug: p.slug,
      university: p.university,
      city: p.city,
      state: p.state,
      dataQuality: p.dataQuality,
      lastVerified: log[p.slug] ?? null,
    }))
    // Oldest / never-verified first. `null` sorts before any timestamp.
    .sort((a, b) => {
      if (a.lastVerified === b.lastVerified) return 0
      if (a.lastVerified === null) return -1
      if (b.lastVerified === null) return 1
      return a.lastVerified < b.lastVerified ? -1 : 1
    })

  const batch = ranked.slice(0, batchSize)
  console.log(JSON.stringify(batch, null, 2))
  const neverVerified = ranked.filter(r => r.lastVerified === null)
  console.error(
    `\n${state ? state + ': ' : ''}batch of ${batch.length}/${pool.length}. ` +
    `${neverVerified.length} never verified (no date yet)${neverVerified.length ? ': ' + neverVerified.map(r => r.slug).join(', ') : ''}. ` +
    `Re-check these against official sources, then run mark-verified.ts on every one you check.`,
  )
}

main()
