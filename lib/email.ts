import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = 'Nursing School Planner <noreply@nursingschoolplanner.com>'

async function send(opts: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log('[email] RESEND_API_KEY not set — skipping email to', opts.to)
    return
  }
  try {
    await resend.emails.send({ from: FROM, ...opts })
  } catch (err) {
    console.error('[email] send failed:', err)
  }
}

export async function sendWelcomeEmail(email: string) {
  await send({
    to: email,
    subject: 'Welcome to Nursing School Planner',
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
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

export async function sendCyclePassConfirmationEmail(email: string) {
  await send({
    to: email,
    subject: 'Your Cycle Pass is active — Nursing School Planner',
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
        <h2 style="color:#0d9488">Cycle Pass activated!</h2>
        <p>You now have full access for your entire application season. Here's what's unlocked:</p>
        <ul>
          <li><strong>Unlimited favorites</strong> — save as many programs as you want</li>
          <li><strong>Full gap analysis</strong> on <a href="https://www.nursingschoolplanner.com/plan">My Plan</a> — see exactly what's missing for every program</li>
          <li><strong>Request a school</strong> — don't see your program? Ask us to add it</li>
        </ul>
        <p style="margin:24px 0">
          <a href="https://www.nursingschoolplanner.com/dashboard"
             style="background:#0d9488;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            Go to my dashboard →
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">Questions? Reply to this email and we'll get back to you.</p>
      </div>
    `,
  })
}
