/**
 * Applies Prisma migration SQL to the database in DATABASE_URL (+ DATABASE_AUTH_TOKEN).
 * Use for a remote Turso/libSQL database, where `prisma migrate deploy` can't connect
 * over the libsql:// protocol.
 *
 * Tracks applied migrations in a `_ndb_migrations` table so each migration runs AT MOST
 * ONCE — important because some Prisma migrations are table rebuilds (CREATE new_X /
 * copy / DROP X / rename) that would silently re-run and reset column data otherwise.
 *
 * Usage (with prod env vars set in your shell or .env):
 *   npx tsx scripts/deploy-db.ts
 *   npx tsx prisma/seed.ts
 *
 * NOTE: for a database that was migrated BEFORE this tracking existed, baseline it first
 * (mark existing migrations as applied) — see scripts/baseline-db.ts.
 */
import { loadEnv } from './_env'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import { libsqlConfig } from '../lib/libsql-config'

async function main() {
  loadEnv() // pass --prod to migrate the live Turso database
  const cfg = libsqlConfig()
  console.log(`Applying migrations to: ${cfg.url}`)
  const client = createClient(cfg)

  await client.execute(
    'CREATE TABLE IF NOT EXISTS "_ndb_migrations" ("name" TEXT PRIMARY KEY, "applied_at" TEXT DEFAULT CURRENT_TIMESTAMP)',
  )
  const appliedRows = await client.execute('SELECT name FROM "_ndb_migrations"')
  const applied = new Set(appliedRows.rows.map(r => String(r.name)))

  const migrationsDir = join(process.cwd(), 'prisma', 'migrations')
  const dirs = readdirSync(migrationsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  for (const dir of dirs) {
    if (applied.has(dir)) {
      console.log(`  • ${dir} … skipped (already applied)`)
      continue
    }
    const sql = readFileSync(join(migrationsDir, dir, 'migration.sql'), 'utf8')
    process.stdout.write(`  • ${dir} … `)
    try {
      await client.executeMultiple(sql)
      await client.execute({ sql: 'INSERT OR IGNORE INTO "_ndb_migrations"(name) VALUES (?)', args: [dir] })
      console.log('applied')
    } catch (err) {
      const msg = String((err as Error)?.message ?? err)
      if (/already exists|duplicate column/i.test(msg)) {
        // Pre-tracking DB: structures exist. Record so we never retry it.
        await client.execute({ sql: 'INSERT OR IGNORE INTO "_ndb_migrations"(name) VALUES (?)', args: [dir] })
        console.log('recorded (already present)')
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
