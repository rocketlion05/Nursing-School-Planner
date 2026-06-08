import { Resend } from 'resend'

const FROM = 'Nursing School Planner <noreply@nursingschoolplanner.com>'
const SITE = 'https://www.nursingschoolplanner.com'
const LOGO_URL = `${SITE}/logo.jpg`

/** Centered logo header reused across every email template. */
const logoHeader = `
  <div style="text-align:center;margin:0 0 24px">
    <img src="${LOGO_URL}" alt="Nursing School Planner" width="120" height="120"
         style="width:120px;height:auto;border-radius:12px" />
  </div>
`

// Lazy getter so CLI scripts that call loadEnv() before importing still work.
function getResend() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
}

async function send(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const resend = getResend()
  if (!resend) {
    console.log('[email] RESEND_API_KEY not set — skipping email to', opts.to)
    return { ok: false as const, skipped: true as const }
  }
  try {
    const { replyTo, ...rest } = opts
    await resend.emails.send({ from: FROM, ...rest, ...(replyTo ? { replyTo } : {}) })
    return { ok: true as const }
  } catch (err) {
    console.error('[email] send failed:', err)
    return { ok: false as const }
  }
}

/**
 * Sent on signup with a one-time link the user must click to confirm their
 * email before their account is activated. `verifyUrl` already contains the token.
 */
export async function sendVerificationEmail(email: string, verifyUrl: string) {
  await send({
    to: email,
    subject: 'Verify your email — Nursing School Planner',
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488;text-align:center">Confirm your email</h2>
        <p>Thanks for signing up for Nursing School Planner! Please confirm your email address to activate your account.</p>
        <p style="margin:24px 0;text-align:center">
          <a href="${verifyUrl}"
             style="background:#0d9488;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
            Verify my email →
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">This link expires in 24 hours. If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="color:#6b7280;font-size:13px;word-break:break-all">${verifyUrl}</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  })
}

/**
 * Sent when a user requests a password reset. `resetUrl` already contains the
 * one-time token. Links expire after 1 hour.
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await send({
    to: email,
    subject: 'Reset your password — Nursing School Planner',
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488;text-align:center">Reset your password</h2>
        <p>We received a request to reset the password for your Nursing School Planner account. Click the button below to choose a new password.</p>
        <p style="margin:24px 0;text-align:center">
          <a href="${resetUrl}"
             style="background:#0d9488;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
            Reset my password →
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">This link expires in 1 hour. If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="color:#6b7280;font-size:13px;word-break:break-all">${resetUrl}</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string) {
  await send({
    to: email,
    subject: 'Welcome to Nursing School Planner',
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488">Welcome to Nursing School Planner!</h2>
        <p>We're glad you're here. This tool helps pre-nursing students compare BSN program requirements across Arkansas, Texas, and top national schools — and build a clear plan to close their gaps.</p>
        <p><strong>Your next step:</strong> finish your profile so we can show you your real odds for each program.</p>
        <p style="margin:24px 0">
          <a href="https://www.nursingschoolplanner.com/dashboard"
             style="background:#0d9488;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            Go to my dashboard →
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">Built by a pre-nursing student at the University of Arkansas to make BSN applications less confusing.</p>
      </div>
    `,
  })
}

/**
 * Confirms Pro access. When `expiresAt` is provided (a 1-month free access code),
 * the email states the access window; otherwise it reads as ongoing (paid plan).
 */
export async function sendProConfirmationEmail(email: string, opts?: { expiresAt?: Date }) {
  const expiresAt = opts?.expiresAt
  const windowLine = expiresAt
    ? `<p>You've unlocked <strong>1 month of Pro for free</strong> — your access runs until <strong>${expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>. Here's what's unlocked:</p>`
    : `<p>Your Pro access is active. Here's what's unlocked:</p>`
  const footerLine = expiresAt
    ? `<p style="color:#6b7280;font-size:13px">When your free month ends you'll move back to the free plan — you can subscribe anytime to keep Pro. Questions? Just reply to this email.</p>`
    : `<p style="color:#6b7280;font-size:13px">Questions? Reply to this email and we'll get back to you.</p>`
  await send({
    to: email,
    subject: expiresAt
      ? 'Your free month of Pro is active — Nursing School Planner'
      : 'Your Pro access is active — Nursing School Planner',
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488">${expiresAt ? 'Pro unlocked — free for a month!' : 'Pro activated!'}</h2>
        ${windowLine}
        <ul>
          <li><strong>Unlimited favorites</strong> — save as many programs as you want</li>
          <li><strong>AI application plan + full gap analysis</strong> on <a href="https://www.nursingschoolplanner.com/plan">My Plan</a></li>
          <li><strong>Deadline tracker, custom lists, and school comparison</strong></li>
          <li><strong>Request a school</strong> — don't see your program? Ask us to add it</li>
        </ul>
        <p style="margin:24px 0">
          <a href="https://www.nursingschoolplanner.com/dashboard"
             style="background:#0d9488;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            Go to my dashboard →
          </a>
        </p>
        ${footerLine}
      </div>
    `,
  })
}

/**
 * Sent by the deadline-reminder runner at 30 / 14 / 7 days before a premium
 * user's saved application deadline.
 */
export async function sendDeadlineReminderEmail({
  to,
  name,
  university,
  deadlineDate,
  daysRemaining,
  label,
}: {
  to: string
  name: string
  university: string
  /** Human-readable date, e.g. "March 1, 2026". */
  deadlineDate: string
  daysRemaining: number
  label?: string
}) {
  const displayName = name || 'there'
  const dayWord = daysRemaining === 1 ? 'day' : 'days'
  const what = label ? `${university} — ${label}` : `${university}`
  await send({
    to,
    subject: `${daysRemaining} ${dayWord} left: ${university} application deadline`,
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488">Deadline reminder</h2>
        <p>Hi ${displayName},</p>
        <p>
          Your application deadline for <strong>${what}</strong> is in
          <strong>${daysRemaining} ${dayWord}</strong> — on <strong>${deadlineDate}</strong>.
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin:16px 0">
          <p style="margin:0;font-size:14px;color:#166534;">
            ⏱&nbsp; Make sure your transcripts, entrance-exam scores, and prerequisites are submitted
            before the deadline. Many programs do not accept late applications.
          </p>
        </div>
        <p style="margin:24px 0">
          <a href="${SITE}/deadlines"
             style="background:#0d9488;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            View my deadlines →
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">
          You're receiving this because you set this deadline in Nursing School Planner.
        </p>
      </div>
    `,
  })
}

// ─── Contact form ──────────────────────────────────────────────────────────────

/** Address that receives contact-form submissions. */
const CONTACT_INBOX = 'nwconnally.work@gmail.com'

/** Escapes user-supplied text before embedding it in an HTML email. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Delivers a contact-form message to the site owner. The sender's email is set
 * as reply-to so the owner can respond directly. Returns whether the send
 * succeeded so the action can show an accurate error.
 */
export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<{ ok: boolean; skipped?: boolean }> {
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')
  const subjectLine = subject?.trim() ? subject.trim() : 'New contact form message'
  return send({
    to: CONTACT_INBOX,
    replyTo: email,
    subject: `[Contact] ${subjectLine}`,
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488">New contact form message</h2>
        <table style="font-size:14px;color:#374151;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;font-weight:600">From:</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600">Email:</td><td>${escapeHtml(email)}</td></tr>
          ${subject?.trim() ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600">Subject:</td><td>${escapeHtml(subject.trim())}</td></tr>` : ''}
        </table>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:14px;line-height:1.6;color:#111">
          ${safeMessage}
        </div>
        <p style="color:#9ca3af;font-size:12px">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
      </div>
    `,
  })
}

// ─── School request emails ────────────────────────────────────────────────────

/**
 * Sent immediately when a premium user submits a school request.
 * Confirms receipt and sets a realistic research time expectation.
 */
export async function sendSchoolRequestConfirmation({
  to,
  name,
  university,
  city,
  state,
}: {
  to: string
  name: string
  university: string
  city: string
  state: string
}) {
  const displayName = name || 'there'
  const location = [city, state].filter(Boolean).join(', ')
  await send({
    to,
    subject: `We received your request — ${university}`,
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488">Request received!</h2>
        <p>Hi ${displayName},</p>
        <p>Thanks for submitting your request! We've added <strong>${university}${location ? ` (${location})` : ''}</strong> to our research queue.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin:16px 0">
          <p style="margin:0;font-size:14px;color:#166534;">
            ⏱&nbsp; <strong>Estimated time:</strong> We typically research new school requests within
            <strong>7–14 days</strong>. Once we've verified the BSN admission requirements we'll update
            the app and send you a follow-up email.
          </p>
        </div>
        <p>In the meantime, explore the 85+ programs already in our database:</p>
        <p style="margin:20px 0">
          <a href="${SITE}/programs"
             style="background:#0d9488;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            Browse Schools →
          </a>
        </p>
        <p>Thanks for helping make the app more useful for everyone.</p>
        <p style="color:#6b7280;font-size:13px">— The Nursing School Planner Team</p>
      </div>
    `,
  })
}

/**
 * Sent by the school-maintenance script when a requested school has no
 * publicly available BSN admission requirements.
 * Call via: resolve-request.ts <id> --wont-add --no-public-info
 */
export async function sendSchoolNotFoundEmail({
  to,
  name,
  university,
  city,
  state,
}: {
  to: string
  name: string
  university: string
  city?: string
  state?: string
}) {
  const displayName = name || 'there'
  const location = [city, state].filter(Boolean).join(', ')
  await send({
    to,
    subject: `Update on your school request: ${university}`,
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        ${logoHeader}
        <h2 style="color:#0d9488">Update: ${university}</h2>
        <p>Hi ${displayName},</p>
        <p>
          We finished researching your request for
          <strong>${university}${location ? ` (${location})` : ''}</strong>
          and wanted to give you an honest update.
        </p>
        <p>
          Unfortunately, after checking official program pages and published resources, we were
          unable to find publicly available BSN admission requirements for this program — no GPA
          minimums, entrance exam details, or prerequisites are posted publicly.
        </p>
        <p>This happens with some programs that use a private or fully holistic review process.
        Here are your best next steps:</p>
        <ol style="padding-left:20px;line-height:1.8">
          <li>
            <strong>Contact an admissions advisor directly</strong> — reach out to the nursing
            department at ${university} and ask for current BSN requirements, GPA cutoffs, and
            required entrance exams.
          </li>
          <li>
            <strong>Visit the school's nursing program page</strong> — look for an "Admissions"
            or "How to Apply" section; requirements sometimes appear in PDFs or program guides
            that aren't easily indexed.
          </li>
          <li>
            <strong>Attend an info session or open house</strong> — many programs share detailed
            requirements at these events that aren't published online.
          </li>
        </ol>
        <p>
          We're sorry we couldn't get this into the app for you. If the school publishes requirements
          publicly in the future, we'll add them automatically.
        </p>
        <p style="color:#6b7280;font-size:13px">— The Nursing School Planner Team</p>
      </div>
    `,
  })
}
