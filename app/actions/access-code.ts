'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'
import { sendCyclePassConfirmationEmail } from '@/lib/email'

export async function redeemAccessCode(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Please log in to redeem a code.' }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })
    if (!profile) return { success: false, error: 'Save your profile before redeeming a code.' }
    const profileId = profile.id

    const accessCode = await prisma.accessCode.findUnique({ where: { code: code.trim().toUpperCase() } })

    if (!accessCode) return { success: false, error: 'Invalid access code.' }
    if (accessCode.usedBy && accessCode.usedBy !== profileId) {
      return { success: false, error: 'This access code has already been used.' }
    }

    await prisma.profile.update({ where: { id: profileId }, data: { tier: 'cycle' } })

    if (!accessCode.usedBy) {
      await prisma.accessCode.update({
        where: { id: accessCode.id },
        data: { usedBy: profileId, usedAt: new Date() },
      })
    }

    revalidatePath('/programs')
    revalidatePath('/pricing')
    revalidatePath('/dashboard')
    sendCyclePassConfirmationEmail(user.email).catch(() => {})
    return { success: true }
  } catch (err) {
    console.error('redeemAccessCode error:', err)
    return { success: false, error: 'Failed to redeem code.' }
  }
}

// ── Admin: generate single-use promotional access codes ──────────────────────

export type AccessCodeRow = {
  code: string
  used: boolean
  usedAt: string | null
  createdAt: string
}

// Crockford-ish alphabet: no 0/O/1/I to avoid promo-code transcription errors.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function makeCode(): string {
  const bytes = randomBytes(8)
  let s = ''
  for (let i = 0; i < 8; i++) s += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
  return `PROMO-${s.slice(0, 4)}-${s.slice(4, 8)}`
}

/** Admin-only. Creates one fresh single-use access code and returns it. */
export async function generateAccessCode(): Promise<{ code?: string; error?: string }> {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) return { error: 'Not authorized.' }

  for (let attempt = 0; attempt < 6; attempt++) {
    const code = makeCode()
    try {
      await prisma.accessCode.create({ data: { code } })
      revalidatePath('/pricing')
      return { code }
    } catch {
      // Unique-constraint collision — vanishingly rare; just try another code.
    }
  }
  return { error: 'Could not generate a unique code. Please try again.' }
}

/** Admin-only. Lists every access code with its redemption status. */
export async function listAccessCodes(): Promise<AccessCodeRow[]> {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) return []

  const rows = await prisma.accessCode.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(r => ({
    code: r.code,
    used: Boolean(r.usedBy),
    usedAt: r.usedAt ? r.usedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  }))
}
