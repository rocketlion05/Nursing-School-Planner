/**
 * Shared env loader for the maintenance scripts.
 *
 * Default: loads `.env` (local dev — file:./dev.db).
 * With `--prod`: loads `.env.production.local` (Turso prod: DATABASE_URL + DATABASE_AUTH_TOKEN).
 *
 * This makes "am I about to touch production?" explicit at the call site instead of
 * depending on ambient env vars. Call loadEnv() BEFORE constructing any Prisma/libSQL
 * client, since libsqlConfig() reads process.env.
 */
import { config } from 'dotenv'
import { existsSync } from 'node:fs'

export function loadEnv(argv: string[] = process.argv): { prod: boolean } {
  const prod = argv.includes('--prod')
  const path = prod ? '.env.production.local' : '.env'
  if (prod && !existsSync(path)) {
    throw new Error(
      `--prod requires ${path} (DATABASE_URL=libsql://… + DATABASE_AUTH_TOKEN). Not found.`,
    )
  }
  config({ path })
  return { prod }
}
