import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/app/lib/session'
import { isAdminEmail } from '@/lib/admin'

export type CurrentUser = {
  id: string
  username: string
  email: string
  name: string
}

/**
 * Returns the logged-in user, or null. Memoized per render pass so multiple
 * components/actions in one request share a single DB lookup.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const userId = await getSessionUserId()
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, name: true },
  })
  return user
})

/** Use in pages/actions that require auth — redirects to /login when absent. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

/** True when the logged-in user is on the admin allow-list. */
export async function getIsAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return isAdminEmail(user?.email)
}
