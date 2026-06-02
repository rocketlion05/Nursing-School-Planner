'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/app/lib/session'
import { SignupSchema, LoginSchema, type AuthFormState } from '@/app/lib/auth-validation'

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

  await createSession(userId)
  redirect('/profile')
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
    select: { id: true, passwordHash: true },
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

  await createSession(user.id)
  redirect('/profile')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/')
}
