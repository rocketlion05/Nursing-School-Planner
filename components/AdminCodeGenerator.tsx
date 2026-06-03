'use client'

import { useState, useTransition } from 'react'
import { generateAccessCode, type AccessCodeRow } from '@/app/actions/access-code'
import { Plus, Copy, Check, Ticket } from 'lucide-react'

export default function AdminCodeGenerator({ initialCodes }: { initialCodes: AccessCodeRow[] }) {
  const [codes, setCodes] = useState<AccessCodeRow[]>(initialCodes)
  const [latest, setLatest] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleGenerate() {
    setError(null)
    startTransition(async () => {
      const res = await generateAccessCode()
      if (res.code) {
        setLatest(res.code)
        setCodes(prev => [
          { code: res.code!, used: false, usedAt: null, createdAt: new Date().toISOString() },
          ...prev,
        ])
      } else {
        setError(res.error ?? 'Failed to generate a code.')
      }
    })
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      setTimeout(() => setCopied(c => (c === code ? null : c)), 1500)
    } catch {
      /* clipboard unavailable — user can select manually */
    }
  }

  const availableCount = codes.filter(c => !c.used).length

  return (
    <div className="mt-5 pt-5 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        <Ticket className="w-4 h-4 text-teal-600" />
        <h4 className="font-semibold text-gray-900 text-sm">Admin — generate promo codes</h4>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Each code unlocks Cycle Pass for one person, one time. Generate as many as you need.
      </p>

      <button
        onClick={handleGenerate}
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {isPending ? 'Generating…' : 'Generate new code'}
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {latest && (
        <div className="mt-3 flex items-center justify-between gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
          <code className="font-mono text-sm font-semibold text-teal-800">{latest}</code>
          <button
            onClick={() => copy(latest)}
            className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-medium"
          >
            {copied === latest ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === latest ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {codes.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">
            {codes.length} code{codes.length !== 1 ? 's' : ''} · {availableCount} available
          </p>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-50">
            {codes.map(c => (
              <div key={c.code} className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm">
                <code className="font-mono text-gray-700">{c.code}</code>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      c.used ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {c.used ? 'used' : 'available'}
                  </span>
                  {!c.used && (
                    <button
                      onClick={() => copy(c.code)}
                      className="text-gray-400 hover:text-teal-600"
                      title="Copy code"
                    >
                      {copied === c.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
