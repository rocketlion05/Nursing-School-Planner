/**
 * Picks the next rotating batch of schools for the maintenance routine to re-verify,
 * so that ALL programs get re-checked over time instead of the same few every run.
 *
 *   npx tsx scripts/verify-queue.ts            # default batch of 12 (JSON on stdout)
 *   npx tsx scripts/verify-queue.ts 20         # custom batch size
 *
 * Ordering: schools never verified come first, then the least-recently-verified,
 * based on prisma/verification-log.json (slug -> ISO timestamp). After re-verifying a
 * batch, the routine calls `scripts/mark-verified.ts <slug...>` to bump their timestamps.
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
  const batchSize = Number(process.argv[2]) || 12
  const log = loadLog()

  const ranked = SEED_PROGRAMS
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
  console.error(
    `\nBatch of ${batch.length}/${SEED_PROGRAMS.length}. ` +
    `${ranked.filter(r => r.lastVerified === null).length} never verified; ` +
    `next call rotates to the following ${batchSize}.`,
  )
}

main()
