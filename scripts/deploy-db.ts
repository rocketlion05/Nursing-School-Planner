/**
 * Applies the Prisma migration SQL to the database pointed at by DATABASE_URL
 * (+ DATABASE_AUTH_TOKEN). Use this for a remote Turso/libSQL database, where
 * `prisma migrate deploy` can't connect over the libsql:// protocol.
 *
 * Usage (with prod env vars set in your shell or .env):
 *   npx tsx scripts/deploy-db.ts
 *   npx tsx prisma/seed.ts          # then seed the 20 programs + access codes
 *
 * Safe to re-run: each statement uses CREATE TABLE / CREATE INDEX as generated
 * by Prisma. For a brand-new database this brings every table into existence.
 */
import 'dotenv/config'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import { libsqlConfig } from '../lib/libsql-config'

async function main() {
  const cfg = libsqlConfig()
  console.log(`Applying migrations to: ${cfg.url}`)
  const client = createClient(cfg)

  const migrationsDir = join(process.cwd(), 'prisma', 'migrations')
  const dirs = readdirSync(migrationsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort() // timestamp-prefixed → chronological order

  for (const dir of dirs) {
    const sql = readFileSync(join(migrationsDir, dir, 'migration.sql'), 'utf8')
    process.stdout.write(`  • ${dir} … `)
    try {
      await client.executeMultiple(sql)
      console.log('applied')
    } catch (err) {
      const msg = String((err as Error)?.message ?? err)
      // Re-running an already-applied migration is expected on a live DB
      // (e.g. "table ... already exists"). Skip those; surface anything else.
      if (/already exists|duplicate column/i.test(msg)) {
        console.log('skipped (already applied)')
      } else {
        console.log('ERROR')
        throw err
      }
    }
  }

  console.log('\nSchema applied. Next: `npx tsx prisma/seed.ts` to load programs.')
  client.close()
}

main().catch(err => {
  console.error('deploy-db failed:', err)
  process.exit(1)
})
