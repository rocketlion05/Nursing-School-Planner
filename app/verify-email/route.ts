import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/app/lib/session'
import { consumeVerificationToken } from '@/lib/verification'
import { sendWelcomeEmail } from '@/lib/email'

/**
 * Handles the link from the verification email. On a valid, unexpired token we
 * mark the account verified, sign the user in, send the welcome email, and drop
 * them on their dashboard. Invalid/expired tokens go back to the "resend" page.
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin
  const token = req.nextUrl.searchParams.get('token') ?? ''

  const userId = await consumeVerificationToken(token)
  if (!userId) {
    return NextResponse.redirect(new URL('/verify-email/sent?status=invalid', origin))
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true },
  })
  if (!user) {
    return NextResponse.redirect(new URL('/verify-email/sent?status=invalid', origin))
  }

  // First successful verification: stamp it and fire the welcome email.
  if (!user.emailVerified) {
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    })
    sendWelcomeEmail(user.email).catch(() => {})
  }

  await createSession(userId)
  return NextResponse.redirect(new URL('/dashboard?welcome=1', origin))
}
