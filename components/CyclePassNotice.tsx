import Link from 'next/link'
import { CalendarClock, AlertCircle } from 'lucide-react'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/** Whole days from now until the given ISO instant (negative if past). */
function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

/**
 * Cycle-pass status banner for the dashboard. Shows the active window, and warns
 * when within 14 days of expiry. Renders nothing when the user has no active
 * pass (the expired case is handled by CyclePassExpiredNotice).
 */
export function CyclePassStatus({ expiry }: { expiry: string | null }) {
  if (!expiry) return null
  const days = daysUntil(expiry)
  const expiringSoon = days <= 14

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
        expiringSoon ? 'bg-amber-50 border-amber-200' : 'bg-teal-50 border-teal-200'
      }`}
    >
      <CalendarClock className={`w-4 h-4 shrink-0 mt-0.5 ${expiringSoon ? 'text-amber-600' : 'text-teal-600'}`} />
      <div className={expiringSoon ? 'text-amber-900' : 'text-teal-900'}>
        {expiringSoon ? (
          <>
            <span className="font-semibold">
              Your cycle pass expires in {days} day{days !== 1 ? 's' : ''}
            </span>{' '}
            (on {formatDate(expiry)}).{' '}
            <Link href="/pricing" className="font-semibold underline">
              Repurchase for your next cycle
            </Link>
            .
          </>
        ) : (
          <>
            <span className="font-semibold">Cycle Pass active</span> — full Pro access through{' '}
            <strong>{formatDate(expiry)}</strong>.
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Shown on a Pro-gated surface when the user's cycle pass has expired. The
 * message + repurchase CTA the spec requires.
 */
export function CyclePassExpiredNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="text-amber-900">
        <span className="font-semibold">Your cycle pass has expired</span> — repurchase for your next
        cycle.{' '}
        <Link href="/pricing" className="font-semibold underline">
          Repurchase now
        </Link>
        .
      </div>
    </div>
  )
}
