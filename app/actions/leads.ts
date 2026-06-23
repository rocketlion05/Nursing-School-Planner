'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendLeadMagnetEmail } from '@/lib/email'
import { SITE_URL } from '@/lib/seo'

const MAGNET = 'bsn-prerequisite-checklist'
const DOWNLOAD_PATH = '/downloads/bsn-prerequisite-checklist.pdf'
const EmailSchema = z.string().trim().toLowerCase().email()

/**
 * Captures an email for the free lead-magnet, stores it (deduped per magnet),
 * emails the download link, and returns the path so the client can offer the
 * download immediately. Best-effort: a DB or email hiccup still lets the user
 * download, since the email is the only thing we gate on.
 */
export async function subscribeToLeadMagnet(
  email: string,
  source?: string,
): Promise<{ ok: boolean; error?: string; downloadPath?: string }> {
  const parsed = EmailSchema.safeParse(email)
  if (!parsed.success) return { ok: false, error: 'Please enter a valid email address.' }
  const addr = parsed.data

  try {
    await prisma.lead.upsert({
      where: { email_magnet: { email: addr, magnet: MAGNET } },
      create: { email: addr, magnet: MAGNET, source: source ?? null },
      update: {},
    })
  } catch (err) {
    console.error('[leads] store failed:', err)
  }

  await sendLeadMagnetEmail(addr, `${SITE_URL}${DOWNLOAD_PATH}`)

  return { ok: true, downloadPath: DOWNLOAD_PATH }
}
