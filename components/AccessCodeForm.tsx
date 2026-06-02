'use client'

import { useState, useTransition } from 'react'
import { redeemAccessCode } from '@/app/actions/access-code'
import { Key, CheckCircle, AlertCircle } from 'lucide-react'

export default function AccessCodeForm() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return

    startTransition(async () => {
      const res = await redeemAccessCode(code)
      if (res.success) {
        setResult({ success: true, message: 'Code accepted! Cycle Pass is now active. Refresh the page to see your new features.' })
      } else {
        setResult({ success: false, message: res.error ?? 'Failed to redeem code.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !code.trim()}
          className="bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? '…' : 'Redeem'}
        </button>
      </div>
      {result && (
        <div className={`flex items-start gap-2 text-sm rounded-lg p-3 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {result.success
            ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          }
          {result.message}
        </div>
      )}
    </form>
  )
}
