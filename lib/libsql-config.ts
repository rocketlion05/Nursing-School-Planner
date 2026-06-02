import type { Config } from '@libsql/client'

/**
 * Builds the libSQL connection config shared by the runtime client (lib/prisma.ts)
 * and the seed script (prisma/seed.ts).
 *
 * Local dev uses a file: SQLite DB with no auth token. Production (Turso) uses a
 * libsql:// URL that REQUIRES an auth token — passing only `url` causes the
 * `ConnectionFailed` errors seen in the Vercel runtime logs. Set both
 * DATABASE_URL and DATABASE_AUTH_TOKEN in the hosting environment.
 */
export function libsqlConfig(): Config {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'
  const authToken = process.env.DATABASE_AUTH_TOKEN
  return authToken ? { url, authToken } : { url }
}
