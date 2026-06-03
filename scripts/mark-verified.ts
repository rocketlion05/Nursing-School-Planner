/**
 * Records that the routine re-checked a set of schools, by bumping their timestamps in
 * prisma/verification-log.json. Drives the rotation in scripts/verify-queue.ts so the
 * batch advances each run. Commit the updated log so the rotation survives across runs.
 *
 *   npx tsx scripts/mark-verified.ts <slug> [<slug> ...]
 *
 * Pass EVERY slug from the batch you re-checked this run (whether or not it changed) —
 * marking it verified is what moves it to the back of the queue.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SEED_PROGRAMS } from '../prisma/programs-data'

const LOG_PATH = join(process.cwd(), 'prisma', 'verification-log.json')

function main() {
  const slugs = process.argv.slice(2).filter(Boolean)
  if (slugs.length === 0) {
    console.error('Usage: mark-verified.ts <slug> [<slug> ...]')
    process.exit(1)
  }

  const known = new Set(SEED_PROGRAMS.map(p => p.slug))
  const unknown = slugs.filter(s => !known.has(s))
  if (unknown.length) {
    console.error(`Unknown slug(s) (not in programs-data.ts): ${unknown.join(', ')}`)
    process.exit(1)
  }

  let log: Record<string, string> = {}
  try {
    const raw = JSON.parse(readFileSync(LOG_PATH, 'utf8'))
    if (raw && typeof raw === 'object') log = raw
  } catch {
    log = {}
  }

  const now = new Date().toISOString()
  for (const s of slugs) log[s] = now

  // Keep the file tidy and deterministic: sorted keys, drop slugs no longer in the data.
  const cleaned: Record<string, string> = {}
  for (const slug of [...known].sort()) {
    if (log[slug]) cleaned[slug] = log[slug]
  }

  writeFileSync(LOG_PATH, JSON.stringify(cleaned, null, 2) + '\n')
  console.log(`Marked ${slugs.length} school(s) verified at ${now}.`)
}

main()
