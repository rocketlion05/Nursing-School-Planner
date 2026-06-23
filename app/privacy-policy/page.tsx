import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Nursing School Planner collects, uses, discloses, and protects your information, including account, profile, and payment data.',
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
}

const SUPPORT_EMAIL = 'hello@nursingschoolplanner.com'
const EFFECTIVE_DATE = 'June 23, 2026'

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">{children}</h2>
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-[15px] text-gray-700 leading-relaxed">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mt-2">Effective date: {EFFECTIVE_DATE}</p>

      <p className="mt-6">
        This Privacy Policy explains how {SITE_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;), operator of {SITE_URL.replace('https://', '')}, collects, uses,
        discloses, and safeguards your information when you use our website and services (the
        &ldquo;Service&rdquo;). By using the Service, you agree to the practices described here.
      </p>

      <H2>1. Information We Collect</H2>
      <p>We collect the following categories of information:</p>
      <ul className="list-disc pl-6 space-y-2 mt-3">
        <li>
          <strong>Account information.</strong> When you create an account, we collect your name,
          email address, username, and a securely hashed password. If you sign in with Google or
          Microsoft, we receive your basic profile and email from that provider instead of a
          password. We also record whether your email has been verified.
        </li>
        <li>
          <strong>Student profile information.</strong> Information you choose to enter to get fit
          scores and recommendations — for example your overall and science GPA, total credit
          hours, completed prerequisite courses, entrance-exam scores (such as TEAS, HESI A2, or
          CASPer), target term, and state preferences.
        </li>
        <li>
          <strong>Activity within the Service.</strong> Schools you save, custom lists, application
          deadlines you track, school requests you submit, messages you send us, and a
          last-active timestamp.
        </li>
        <li>
          <strong>Payment information.</strong> If you purchase a paid plan, payment is processed
          by our payment provider, Stripe. We do <strong>not</strong> collect or store your full
          card number — Stripe handles card data directly. We store related identifiers (such as a
          Stripe customer or subscription ID) and your current plan/subscription status.
        </li>
        <li>
          <strong>Technical and usage data.</strong> A session cookie to keep you signed in, plus
          standard analytics and performance data (such as pages viewed, approximate device/browser
          information, and load-time metrics) collected through our hosting and analytics providers.
        </li>
      </ul>

      <H2>2. How We Use Your Information</H2>
      <ul className="list-disc pl-6 space-y-2 mt-3">
        <li>To provide and operate the Service, including calculating your fit for nursing programs and generating your personalized application plan.</li>
        <li>To create and authenticate your account and keep you securely signed in.</li>
        <li>To process payments and manage subscriptions and access.</li>
        <li>To send you transactional emails — email verification, password resets, deadline reminders, welcome messages, and replies to your inquiries.</li>
        <li>To maintain, secure, debug, and improve the Service and understand how it is used.</li>
        <li>To comply with legal obligations and enforce our terms.</li>
      </ul>
      <p className="mt-3">We do <strong>not</strong> sell your personal information.</p>

      <H2>3. How and With Whom We Disclose Information</H2>
      <p>
        We share information only as needed to operate the Service, with the following categories of
        third-party service providers (&ldquo;subprocessors&rdquo;). Disclosure is made
        electronically over encrypted (HTTPS/TLS) connections through these providers&rsquo; APIs,
        solely so they can perform services on our behalf:
      </p>
      <ul className="list-disc pl-6 space-y-2 mt-3">
        <li>
          <strong>Stripe</strong> — payment processing and subscription billing. See{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Stripe&rsquo;s Privacy Policy</a>.
        </li>
        <li>
          <strong>Resend</strong> — delivery of transactional and account emails.
        </li>
        <li>
          <strong>OpenAI</strong> — generates your AI application plan. When you use that feature,
          relevant profile and saved-school information is sent to OpenAI to produce the plan.
        </li>
        <li>
          <strong>Vercel</strong> — website hosting, plus privacy-friendly analytics and performance
          monitoring.
        </li>
        <li>
          <strong>Turso (libSQL)</strong> — secure cloud database hosting where your account and
          profile data are stored.
        </li>
        <li>
          <strong>Google and Microsoft</strong> — only if you choose to sign in with one of these
          providers, for authentication.
        </li>
      </ul>
      <p className="mt-3">
        We may also disclose information when required by law, to respond to lawful requests or legal
        process, to protect the rights, property, or safety of our users or others, or in connection
        with a merger, acquisition, or sale of assets (in which case we will notify affected users).
      </p>

      <H2>4. How We Protect Your Information</H2>
      <ul className="list-disc pl-6 space-y-2 mt-3">
        <li>All traffic to and from the Service is encrypted in transit using HTTPS/TLS.</li>
        <li>Passwords are never stored in plain text — they are hashed with bcrypt.</li>
        <li>Sessions use signed, HTTP-only cookies (JWTs), reducing exposure to client-side theft.</li>
        <li>Payment card data is handled directly by Stripe, a PCI-DSS Level 1 certified provider; we never receive or store full card numbers.</li>
        <li>Access to stored data is restricted to authorized operations of the Service, and access to administrative functions is limited to designated administrators.</li>
      </ul>
      <p className="mt-3">
        No method of transmission or storage is 100% secure, so while we work to protect your
        information we cannot guarantee absolute security.
      </p>

      <H2>5. Your Choices and Rights</H2>
      <ul className="list-disc pl-6 space-y-2 mt-3">
        <li>You can review and update your profile information at any time from your account.</li>
        <li>You can manage or cancel a paid subscription through the billing portal in the app.</li>
        <li>
          You may request access to, correction of, or deletion of your personal data by emailing us
          at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-teal-600 underline">{SUPPORT_EMAIL}</a>.
          We will delete your account and associated personal data on request, subject to records we
          must retain for legal or accounting purposes.
        </li>
      </ul>

      <H2>6. Data Retention</H2>
      <p>
        We retain your information for as long as your account is active or as needed to provide the
        Service. After account deletion, we remove your personal data except where retention is
        required for legal, tax, or fraud-prevention purposes (for example, payment records held by
        Stripe).
      </p>

      <H2>7. Cookies</H2>
      <p>
        We use a strictly necessary session cookie to keep you signed in. Our analytics providers may
        set or read limited identifiers to measure usage and performance. You can control cookies
        through your browser settings, though disabling the session cookie will prevent you from
        signing in.
      </p>

      <H2>8. Children&rsquo;s Privacy</H2>
      <p>
        The Service is intended for prospective college and nursing-school applicants and is not
        directed to children under 13. We do not knowingly collect personal information from children
        under 13. If you believe a child has provided us information, please contact us and we will
        delete it.
      </p>

      <H2>9. Changes to This Policy</H2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the
        &ldquo;Effective date&rdquo; above and, for material changes, take reasonable steps to notify
        you. Your continued use of the Service after an update constitutes acceptance of the revised
        policy.
      </p>

      <H2>10. Contact Us</H2>
      <p>
        If you have questions about this Privacy Policy or your data, contact us at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-teal-600 underline">{SUPPORT_EMAIL}</a>{' '}
        or through our <Link href="/contact" className="text-teal-600 underline">contact page</Link>.
      </p>
    </div>
  )
}
