'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/app/lib/session'
import {
  SignupSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type AuthFormState,
} from '@/app/lib/auth-validation'
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email'
import {
  createVerificationToken,
  createPasswordResetToken,
  consumePasswordResetToken,
} from '@/lib/verification'
import { getBaseUrl } from '@/lib/base-url'

/** Builds the absolute /verify-email link for a freshly minted token. */
async function buildVerifyUrl(userId: string): Promise<string> {
  const token = await createVerificationToken(userId)
  const base = await getBaseUrl()
  return `${base}/verify-email?token=${token}`
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    username: String(formData.get('username') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  }
  const values = { username: raw.username, email: raw.email }

  const parsed = SignupSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values }
  }

  const { username, email, password } = parsed.data

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
    select: { username: true, email: true },
  })
  if (existing) {
    const field = existing.email === email ? 'email' : 'username'
    return {
      errors: { [field]: [`That ${field} is already taken.`] },
      values,
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  let userId: string
  try {
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
      select: { id: true },
    })
    userId = user.id
  } catch (err) {
    console.error('signup error:', err)
    return { message: 'Could not create your account. Please try again.', values }
  }

  // No session yet — the account is inactive until the email is verified.
  const verifyUrl = await buildVerifyUrl(userId)
  await sendVerificationEmail(email, verifyUrl)

  redirect(`/verify-email/sent?email=${encodeURIComponent(email)}`)
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    identifier: String(formData.get('identifier') ?? ''),
    password: String(formData.get('password') ?? ''),
  }
  const values = { identifier: raw.identifier }

  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values }
  }

  const { identifier, password } = parsed.data
  const normalized = identifier.toLowerCase()

  const user = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: normalized }] },
    select: { id: true, email: true, passwordHash: true, emailVerified: true },
  })

  // Generic message to avoid leaking which accounts exist.
  const invalid: AuthFormState = { message: 'Invalid username/email or password.', values }

  if (!user || !user.passwordHash) {
    // No password set → this account uses social login only.
    if (user && !user.passwordHash) {
      return {
        message: 'This account uses Google or Microsoft sign-in. Use that button instead.',
        values,
      }
    }
    return invalid
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return invalid

  // Correct password, but the email hasn't been confirmed yet. Send them to the
  // "check your email" page where they can re-send the link — don't sign them in.
  if (!user.emailVerified) {
    redirect(`/verify-email/sent?email=${encodeURIComponent(user.email)}&status=unverified`)
  }

  await createSession(user.id)
  redirect('/dashboard')
}

/**
 * Re-sends the verification link. Always reports success (never reveals whether
 * an account exists or its verification state) to avoid account enumeration.
 */
export async function resendVerification(
  _prevState: { sent: boolean } | undefined,
  formData: FormData,
): Promise<{ sent: boolean }> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, emailVerified: true },
    })
    // Only password accounts that still need verifying get a fresh link.
    if (user && user.passwordHash && !user.emailVerified) {
      const verifyUrl = await buildVerifyUrl(user.id)
      await sendVerificationEmail(email, verifyUrl)
    }
  }

  return { sent: true }
}

/**
 * Starts the password-reset flow. Always reports success (never reveals whether
 * an account exists) to avoid account enumeration. Only password accounts that
 * have a usable password get a reset link — OAuth-only accounts are skipped.
 */
export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = { email: String(formData.get('email') ?? '') }
  const values = { email: raw.email }

  const parsed = ForgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values }
  }

  const { email } = parsed.data

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    })
    if (user?.passwordHash) {
      const token = await createPasswordResetToken(user.id)
      const base = await getBaseUrl()
      await sendPasswordResetEmail(email, `${base}/reset-password?token=${token}`)
    }
  } catch (err) {
    console.error('requestPasswordReset error:', err)
    // Still report success below — don't leak failures or account existence.
  }

  // Generic confirmation regardless of whether the account exists.
  return { message: 'sent', values }
}

/**
 * Completes the password-reset flow: validates the new password, consumes the
 * one-time token, updates the password hash, signs the user in, and redirects.
 */
export async function resetPassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    token: String(formData.get('token') ?? ''),
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
  }

  const parsed = ResetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  const { token, password } = parsed.data

  const userId = await consumePasswordResetToken(token)
  if (!userId) {
    return {
      message: 'This reset link is invalid or has expired. Please request a new one.',
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    })
    // Resetting via an emailed link also proves the user controls the inbox,
    // so confirm their email if it wasn't already verified.
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        emailVerified: existing?.emailVerified ?? new Date(),
      },
    })
  } catch (err) {
    console.error('resetPassword error:', err)
    return { message: 'Could not reset your password. Please try again.' }
  }

  await createSession(userId)
  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/')
}
