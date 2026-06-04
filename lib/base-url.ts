import 'server-only'
import { headers } from 'next/headers'

/**
 * Absolute base URL for building links in emails / redirects. Prefers the
 * explicit OAUTH_REDIRECT_BASE_URL (already set for the OAuth flow), falling
 * back to the incoming request's host so local dev and previews work too.
 */
export async function getBaseUrl(): Promise<string> {
  const envBase = process.env.OAUTH_REDIRECT_BASE_URL?.replace(/\/$/, '')
  if (envBase) return envBase

  const h = await headers()
  const host = h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}
