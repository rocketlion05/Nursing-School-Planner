import * as z from 'zod'

/** Standard password strength rules. */
export const passwordSchema = z
  .string()
  .min(8, { error: 'Be at least 8 characters long.' })
  .regex(/[a-z]/, { error: 'Contain at least one lowercase letter.' })
  .regex(/[A-Z]/, { error: 'Contain at least one uppercase letter.' })
  .regex(/[0-9]/, { error: 'Contain at least one number.' })
  .regex(/[^a-zA-Z0-9]/, { error: 'Contain at least one special character.' })

export const usernameSchema = z
  .string()
  .trim()
  .min(3, { error: 'Username must be at least 3 characters.' })
  .max(20, { error: 'Username must be at most 20 characters.' })
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: 'Username may only contain letters, numbers, and underscores.',
  })

export const SignupSchema = z.object({
  username: usernameSchema,
  email: z.email({ error: 'Please enter a valid email.' }).trim().toLowerCase(),
  password: passwordSchema,
})

export const LoginSchema = z.object({
  // Accepts either a username or an email address.
  identifier: z.string().trim().min(1, { error: 'Enter your username or email.' }),
  password: z.string().min(1, { error: 'Enter your password.' }),
})

export type SignupFields = 'username' | 'email' | 'password'

export type AuthFormState =
  | {
      errors?: Partial<Record<string, string[]>>
      message?: string
      values?: Record<string, string>
    }
  | undefined
