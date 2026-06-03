/**
 * Admin allow-list. The owner account is hard-coded so admin works without any
 * Vercel env config; ALLOWED_ADMIN_EMAILS (comma-separated) can add more.
 *
 * Admins implicitly get Cycle Pass (premium) everywhere and can generate access codes.
 */
const DEFAULT_ADMIN_EMAILS = ['nwconnally@gmail.com']

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const e = email.trim().toLowerCase()
  const fromEnv = (process.env.ALLOWED_ADMIN_EMAILS ?? '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
  return DEFAULT_ADMIN_EMAILS.includes(e) || fromEnv.includes(e)
}
