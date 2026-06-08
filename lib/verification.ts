import 'server-only'
import { randomBytes, createHash } from 'node:crypto'
import { prisma } from '@/lib/prisma'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60 // 1 hour — password reset links are short-lived

/** Tokens are high-entropy random strings; we store only their SHA-256 hash. */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Issues a fresh email-verification token for a user, invalidating any older
 * ones. Returns the raw token to embed in the verification link (only the hash
 * is persisted).
 */
export async function createVerificationToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)

  await prisma.verificationToken.deleteMany({ where: { userId } })
  await prisma.verificationToken.create({ data: { tokenHash, userId, expiresAt } })

  return token
}

/**
 * Validates and single-use-consumes a verification token. Returns the userId on
 * success, or null if the token is unknown or expired. The token row is always
 * deleted on a hash match (success or expired) so links can't be replayed.
 */
export async function consumeVerificationToken(token: string): Promise<string | null> {
  if (!token) return null
  const tokenHash = hashToken(token)

  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } })
  if (!record) return null

  await prisma.verificationToken.delete({ where: { id: record.id } })

  if (record.expiresAt.getTime() < Date.now()) return null
  return record.userId
}

/**
 * Issues a fresh password-reset token for a user, invalidating any older ones.
 * Returns the raw token to embed in the reset link (only the hash is persisted).
 * Reset tokens expire after 1 hour.
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await prisma.passwordResetToken.deleteMany({ where: { userId } })
  await prisma.passwordResetToken.create({ data: { tokenHash, userId, expiresAt } })

  return token
}

/**
 * Validates and single-use-consumes a password-reset token. Returns the userId
 * on success, or null if the token is unknown or expired. The token row is
 * always deleted on a hash match so links can't be replayed.
 */
export async function consumePasswordResetToken(token: string): Promise<string | null> {
  if (!token) return null
  const tokenHash = hashToken(token)

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } })
  if (!record) return null

  await prisma.passwordResetToken.delete({ where: { id: record.id } })

  if (record.expiresAt.getTime() < Date.now()) return null
  return record.userId
}
