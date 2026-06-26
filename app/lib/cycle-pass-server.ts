import 'server-only'
import { prisma } from '@/lib/prisma'

/**
 * Records a purchased Cycle Pass. Idempotent and write-once: keyed on the Stripe
 * session id, the `update: {}` makes re-delivery (webhook + success page) a
 * no-op so the immutable `expiryDate` (purchase + 180 days) can never change
 * after creation. Returns true if a new pass row was created.
 */
export async function recordCyclePass(
  userId: string,
  stripeSessionId: string,
  expiry: Date,
): Promise<boolean> {
  // Ensure the buyer has a profile (the premium holder) to attach the pass to.
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  })

  const existing = await prisma.cyclePass.findUnique({
    where: { stripeSessionId },
    select: { id: true },
  })
  await prisma.cyclePass.upsert({
    where: { stripeSessionId },
    create: { profileId: profile.id, stripeSessionId, expiryDate: expiry },
    update: {}, // immutable — never recompute or overwrite an existing pass
  })
  return !existing
}
