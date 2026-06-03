'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'

const ALLOWED_STATUSES = ['new', 'in_progress', 'added', 'wont_add', 'pending', 'fulfilled', 'rejected']

function isAdmin(userEmail: string | undefined, secret: string | undefined): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS ?? '')
    .split(',').map(s => s.trim()).filter(Boolean)
  return (!!adminSecret && secret === adminSecret) ||
         (!!userEmail && allowedEmails.includes(userEmail))
}

export async function updateRequestStatus(
  requestId: string,
  status: string,
  secret: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!isAdmin(user?.email, secret)) {
    return { ok: false, error: 'Not authorized.' }
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return { ok: false, error: 'Invalid status.' }
  }
  try {
    await prisma.schoolRequest.update({ where: { id: requestId }, data: { status } })
    return { ok: true }
  } catch {
    return { ok: false, error: 'DB error.' }
  }
}
