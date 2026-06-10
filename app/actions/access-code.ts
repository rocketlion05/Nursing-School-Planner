'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'
import { sendProConfirmationEmail } from '@/lib/email'

/** 'month' codes grant this many days of Pro; 'lifetime' codes never expire. */
const CODE_GRANT_DAYS = 30

export type AccessCodeType = 'month' | 'lifetime'

export async function redeemAccessCode(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Please log in to redeem a code.' }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, tier: true, premiumUntil: true },
    })
    if (!profile) return { success: false, error: 'Save your profile before redeeming a code.' }
    const profileId = profile.id

    const accessCode = await prisma.accessCode.findUnique({ where: { code: code.trim().toUpperCase() } })
    if (!accessCode) return { success: false, error: 'Invalid access code.' }

    const alreadyRedeemed = await prisma.accessCodeRedemption.findUnique({
      where: { codeId_profileId: { codeId: accessCode.id, profileId } },
    })
    if (alreadyRedeemed) return { success: false, error: 'You have already redeemed this code.' }

    if (accessCode.usedCount >= accessCode.maxUses) {
      return { success: false, error: 'This access code has reached its redemption limit.' }
    }

    const lifetime = accessCode.type === 'lifetime'
    // premiumUntil null + tier cycle = unlimited Pro (subscription, admin grant, or
    // lifetime code) — a dated month code must never shorten that.
    if (!lifetime && profile.tier === 'cycle' && profile.premiumUntil === null) {
      return { success: false, error: 'You already have unlimited Pro access — no code needed!' }
    }

    // Consume a use atomically so concurrent redemptions can't exceed maxUses.
    const consumed = await prisma.accessCode.updateMany({
      where: { id: accessCode.id, usedCount: { lt: accessCode.maxUses } },
      data: { usedCount: { increment: 1 } },
    })
    if (consumed.count === 0) {
      return { success: false, error: 'This access code has reached its redemption limit.' }
    }

    try {
      await prisma.accessCodeRedemption.create({ data: { codeId: accessCode.id, profileId } })
    } catch {
      // Unique-constraint race: same profile redeemed concurrently. Release the use.
      await prisma.accessCode.update({
        where: { id: accessCode.id },
        data: { usedCount: { decrement: 1 } },
      })
      return { success: false, error: 'You have already redeemed this code.' }
    }

    // Grant: lifetime → no expiry; month → 30 days, stacking on any future expiry
    // so redeeming a second code extends rather than shortens access.
    let premiumUntil: Date | null = null
    if (!lifetime) {
      const now = Date.now()
      const base =
        profile.premiumUntil && profile.premiumUntil.getTime() > now ? profile.premiumUntil.getTime() : now
      premiumUntil = new Date(base + CODE_GRANT_DAYS * 24 * 60 * 60 * 1000)
    }

    await prisma.profile.update({ where: { id: profileId }, data: { tier: 'cycle', premiumUntil } })

    revalidatePath('/programs')
    revalidatePath('/pricing')
    revalidatePath('/dashboard')
    sendProConfirmationEmail(user.email, premiumUntil ? { expiresAt: premiumUntil } : undefined).catch(() => {})
    return { success: true }
  } catch (err) {
    console.error('redeemAccessCode error:', err)
    return { success: false, error: 'Failed to redeem code.' }
  }
}

// ── Admin: generate and manage promotional access codes ──────────────────────

export type AccessCodeRow = {
  code: string
  type: AccessCodeType
  maxUses: number
  usedCount: number
  createdAt: string
}

// Crockford-ish alphabet: no 0/O/1/I to avoid promo-code transcription errors.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomSuffix(): string {
  const bytes = randomBytes(8)
  let s = ''
  for (let i = 0; i < 8; i++) s += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
  return `${s.slice(0, 4)}-${s.slice(4, 8)}`
}

function makeCode(type: AccessCodeType): string {
  return `${type === 'lifetime' ? 'LIFE' : 'PROMO'}-${randomSuffix()}`
}

function toRow(r: {
  code: string
  type: string
  maxUses: number
  usedCount: number
  createdAt: Date
}): AccessCodeRow {
  return {
    code: r.code,
    type: r.type === 'lifetime' ? 'lifetime' : 'month',
    maxUses: r.maxUses,
    usedCount: r.usedCount,
    createdAt: r.createdAt.toISOString(),
  }
}

async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return isAdminEmail(user?.email)
}

/** Admin-only. Creates one fresh random single-use code of the given type. */
export async function generateAccessCode(
  type: AccessCodeType,
): Promise<{ row?: AccessCodeRow; error?: string }> {
  if (!(await requireAdmin())) return { error: 'Not authorized.' }
  if (type !== 'month' && type !== 'lifetime') return { error: 'Invalid code type.' }

  for (let attempt = 0; attempt < 6; attempt++) {
    const code = makeCode(type)
    try {
      const created = await prisma.accessCode.create({ data: { code, type } })
      revalidatePath('/admin/requests')
      return { row: toRow(created) }
    } catch {
      // Unique-constraint collision — vanishingly rare; just try another code.
    }
  }
  return { error: 'Could not generate a unique code. Please try again.' }
}

/**
 * Admin-only. Creates a custom-named code (e.g. for a content-creator giveaway)
 * with a chosen type and redemption limit.
 */
export async function createCustomCode(input: {
  code: string
  type: AccessCodeType
  maxUses: number
}): Promise<{ row?: AccessCodeRow; error?: string }> {
  if (!(await requireAdmin())) return { error: 'Not authorized.' }

  const code = input.code.trim().toUpperCase()
  if (!/^[A-Z0-9][A-Z0-9-]{2,30}[A-Z0-9]$/.test(code)) {
    return { error: 'Code must be 4–32 letters, numbers, or dashes (no leading/trailing dash).' }
  }
  if (input.type !== 'month' && input.type !== 'lifetime') return { error: 'Invalid code type.' }
  const maxUses = Math.floor(input.maxUses)
  if (!Number.isFinite(maxUses) || maxUses < 1 || maxUses > 100000) {
    return { error: 'Max uses must be between 1 and 100,000.' }
  }

  try {
    const created = await prisma.accessCode.create({ data: { code, type: input.type, maxUses } })
    revalidatePath('/admin/requests')
    return { row: toRow(created) }
  } catch {
    return { error: 'That code already exists — pick a different one.' }
  }
}

/** Admin-only. Deletes every fully-used code and returns how many were removed. */
export async function clearUsedCodes(): Promise<{ removed?: number; error?: string }> {
  if (!(await requireAdmin())) return { error: 'Not authorized.' }

  const all = await prisma.accessCode.findMany({ select: { id: true, maxUses: true, usedCount: true } })
  const usedUp = all.filter(c => c.usedCount >= c.maxUses).map(c => c.id)
  if (usedUp.length === 0) return { removed: 0 }

  const res = await prisma.accessCode.deleteMany({ where: { id: { in: usedUp } } })
  revalidatePath('/admin/requests')
  return { removed: res.count }
}

/** Admin-only. Lists every access code with its redemption status. */
export async function listAccessCodes(): Promise<AccessCodeRow[]> {
  if (!(await requireAdmin())) return []

  const rows = await prisma.accessCode.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toRow)
}
