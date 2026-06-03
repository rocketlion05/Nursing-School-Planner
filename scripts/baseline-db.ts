/**
 * One-time baseline for a database that was migrated BEFORE scripts/deploy-db.ts
 * started tracking migrations. Records ALL current migrations as "applied" WITHOUT
 * running them, so deploy-db.ts won't re-run (and corrupt) already-applied
 * rebuild migrations. Safe to run repeatedly (idempotent).
 *
 *   npx tsx scripts/baseline-db.ts   # with prod DATABASE_URL + DATABASE_AUTH_TOKEN set
 */
import 'dotenv/config'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import { libsqlConfig } from '../lib/libsql-config'

async function main() {
  const cfg = libsqlConfig()
  console.log(`Baselining migration tracking on: ${cfg.url}`)
  const client = createClient(cfg)

  await client.execute(
    'CREATE TABLE IF NOT EXISTS "_ndb_migrations" ("name" TEXT PRIMARY KEY, "applied_at" TEXT DEFAULT CURRENT_TIMESTAMP)',
  )

  const dirs = readdirSync(join(process.cwd(), 'prisma', 'migrations'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  for (const dir of dirs) {
    await client.execute({ sql: 'INSERT OR IGNORE INTO "_ndb_migrations"(name) VALUES (?)', args: [dir] })
    console.log(`  • recorded ${dir}`)
  }

  console.log(`\nBaselined ${dirs.length} migrations. deploy-db.ts will now skip these.`)
  client.close()
}

main().catch(err => {
  console.error('baseline-db failed:', err)
  process.exit(1)
})
