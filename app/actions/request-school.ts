'use server'

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'

export type SchoolRequestInput = {
  schoolName: string
  university: string
  city: string
  state: string
  programType: string
  reason: string
}

export type SchoolRequestResult = { ok: boolean; error?: string; needsUpgrade?: boolean }

/** True when the logged-in user holds a paid (Cycle Pass) profile. */
async function isPremium(userId: string): Promise<boolean> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { tier: true },
  })
  return profile?.tier === 'cycle'
}

export async function submitSchoolRequest(input: SchoolRequestInput): Promise<SchoolRequestResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { ok: false, error: 'Please log in to request a school.', needsUpgrade: true }
  }
  if (!(await isPremium(user.id))) {
    return {
      ok: false,
      error: 'Requesting a school is a Cycle Pass feature. Upgrade to unlock it.',
      needsUpgrade: true,
    }
  }

  const schoolName = input.schoolName.trim()
  const university = input.university.trim()
  const state = input.state.trim().toUpperCase()
  if (!schoolName || !university || !state) {
    return { ok: false, error: 'School name, university, and state are required.' }
  }

  const record = {
    schoolName,
    university,
    city: input.city.trim(),
    state,
    programType: input.programType.trim() || 'BSN',
    reason: input.reason.trim() || null,
    requestedBy: user.id,
  }

  try {
    await prisma.schoolRequest.create({ data: record })
  } catch (err) {
    console.error('submitSchoolRequest db error:', err)
    return { ok: false, error: 'Could not save your request. Please try again.' }
  }

  // Best-effort mirror to a local file. This works in local dev; on serverless
  // hosts the filesystem is read-only so this silently no-ops (the DB row is the
  // durable source of truth).
  try {
    const file = path.join(process.cwd(), 'requested-schools.json')
    let existing: unknown[] = []
    try {
      existing = JSON.parse(await fs.readFile(file, 'utf8'))
      if (!Array.isArray(existing)) existing = []
    } catch {
      existing = []
    }
    existing.push({ ...record, requestedByUsername: user.username, createdAt: new Date().toISOString() })
    await fs.writeFile(file, JSON.stringify(existing, null, 2))
  } catch {
    // ignore — DB already has it
  }

  return { ok: true }
}
