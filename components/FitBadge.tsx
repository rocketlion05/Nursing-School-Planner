import type { FitStatus } from '@/types'
import clsx from 'clsx'

const styles: Record<FitStatus, string> = {
  Safe: 'bg-green-100 text-green-800 border-green-200',
  Match: 'bg-blue-100 text-blue-800 border-blue-200',
  Reach: 'bg-amber-100 text-amber-800 border-amber-200',
  'Not eligible': 'bg-red-100 text-red-700 border-red-200',
  'No profile': 'bg-gray-100 text-gray-600 border-gray-200',
  Unverified: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function FitBadge({ status, size = 'md' }: { status: FitStatus; size?: 'sm' | 'md' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center border rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        styles[status],
      )}
    >
      {status}
    </span>
  )
}
