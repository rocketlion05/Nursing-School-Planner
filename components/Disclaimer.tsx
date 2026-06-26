import { AlertTriangle } from 'lucide-react'
import { DISCLAIMER } from '@/lib/constants'

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
        <strong>Note:</strong> {DISCLAIMER}
      </p>
    )
  }

  return (
    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
      <div>
        <strong className="block mb-1">Planning Tool: Not Official Admissions Advice</strong>
        {DISCLAIMER}
      </div>
    </div>
  )
}
