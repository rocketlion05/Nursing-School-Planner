import * as z from 'zod'

export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Please enter your name.' })
    .max(100, { error: 'Name is too long.' }),
  email: z.email({ error: 'Please enter a valid email.' }).trim().toLowerCase(),
  subject: z.string().trim().max(150, { error: 'Subject is too long.' }).optional(),
  message: z
    .string()
    .trim()
    .min(10, { error: 'Please enter a message of at least 10 characters.' })
    .max(2000, { error: 'Message is too long (2000 characters max).' }),
})

export type ContactFormState =
  | {
      ok?: boolean
      errors?: Partial<Record<'name' | 'email' | 'subject' | 'message', string[]>>
      message?: string
      values?: Record<string, string>
    }
  | undefined
