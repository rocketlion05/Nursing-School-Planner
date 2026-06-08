'use server'

import { ContactSchema, type ContactFormState } from '@/app/lib/contact-validation'
import { sendContactEmail } from '@/lib/email'

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    subject: String(formData.get('subject') ?? ''),
    message: String(formData.get('message') ?? ''),
  }
  // Preserve what the user typed so the form can refill on error.
  const values = raw

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values }
  }

  const result = await sendContactEmail(parsed.data)

  if (!result.ok) {
    return {
      message: result.skipped
        ? 'Messaging is not configured on this server yet. Please email us directly at nwconnally.work@gmail.com.'
        : 'Something went wrong sending your message. Please try again in a moment.',
      values,
    }
  }

  return { ok: true }
}
