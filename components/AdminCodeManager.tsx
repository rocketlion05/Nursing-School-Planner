'use client'

import { useState, useTransition } from 'react'
import {
  generateAccessCode,
  createCustomCode,
  clearUsedCodes,
  type AccessCodeRow,
  type AccessCodeType,
} from '@/app/actions/access-code'
import { Plus, Copy, Check, Ticket, Trash2, Sparkles, Infinity as InfinityIcon } from 'lucide-react'

function isUsedUp(c: AccessCodeRow): boolean {
  return c.usedCount >= c.maxUses
}

export default function AdminCodeManager({ initialCodes }: { initialCodes: AccessCodeRow[] }) {
  const [codes, setCodes] = useState<AccessCodeRow[]>(initialCodes)
  const [latest, setLatest] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Custom-code form ("+" button)
  const [showCustom, setShowCustom] = useState(false)
  const [customCode, setCustomCode] = useState('')
  const [customType, setCustomType] = useState<AccessCodeType>('month')
  const [customMaxUses, setCustomMaxUses] = useState('1')

  function run(fn: () => Promise<void>) {
    setError(null)
    setNotice(null)
    startTransition(fn)
  }

  function handleGenerate(type: AccessCodeType) {
    run(async () => {
      const res = await generateAccessCode(type)
      if (res.row) {
        setLatest(res.row.code)
        setCodes(prev => [res.row!, ...prev])
      } else {
        setError(res.error ?? 'Failed to generate a code.')
      }
    })
  }

  function handleCreateCustom() {
    const maxUses = parseInt(customMaxUses, 10)
    run(async () => {
      const res = await createCustomCode({ code: customCode, type: customType, maxUses })
      if (res.row) {
        setLatest(res.row.code)
        setCodes(prev => [res.row!, ...prev])
        setCustomCode('')
        setCustomMaxUses('1')
        setShowCustom(false)
      } else {
        setError(res.error ?? 'Failed to create the code.')
      }
    })
  }

  function handleClear() {
    run(async () => {
      const res = await clearUsedCodes()
      if (res.error) {
        setError(res.error)
      } else {
        setCodes(prev => prev.filter(c => !isUsedUp(c)))
        setLatest(null)
        setNotice(
          res.removed === 0
            ? 'No used-up codes to clear.'
            : `Cleared ${res.removed} used-up code${res.removed === 1 ? '' : 's'}.`,
        )
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

  const availableCount = codes.filter(c => !isUsedUp(c)).length
  const usedUpCount = codes.length - availableCount

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-1">
        <Ticket className="w-4 h-4 text-teal-600" />
        <h2 className="text-lg font-semibold text-gray-900">Access Codes</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        1-month codes give a free month of Pro. Lifetime codes give permanent Pro, for content
        creators. Custom codes let you pick the name and how many people can redeem it.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => handleGenerate('month')}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generate 1-month code
        </button>
        <button
          onClick={() => handleGenerate('lifetime')}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <InfinityIcon className="w-4 h-4" />
          Generate lifetime code
        </button>
        <button
          onClick={() => setShowCustom(s => !s)}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
          title="Create a custom code"
        >
          <Plus className="w-4 h-4" />
          Custom
        </button>
        <div className="flex-1" />
        <button
          onClick={handleClear}
          disabled={isPending || usedUpCount === 0}
          className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 disabled:opacity-40 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear used ({usedUpCount})
        </button>
      </div>

      {showCustom && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Custom code</label>
              <input
                type="text"
                value={customCode}
                onChange={e => setCustomCode(e.target.value.toUpperCase())}
                placeholder="e.g. SARAH-RN-2026"
                maxLength={32}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select
                value={customType}
                onChange={e => setCustomType(e.target.value as AccessCodeType)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="month">1 month</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max uses</label>
              <input
                type="number"
                min={1}
                max={100000}
                value={customMaxUses}
                onChange={e => setCustomMaxUses(e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={handleCreateCustom}
              disabled={isPending || customCode.trim().length < 4}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {notice && <p className="text-sm text-gray-500 mb-3">{notice}</p>}

      {latest && (
        <div className="mb-4 flex items-center justify-between gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
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

      {codes.length === 0 ? (
        <p className="text-gray-400 text-sm">No codes yet. Generate one above.</p>
      ) : (
        <>
          <p className="text-xs font-medium text-gray-500 mb-2">
            {codes.length} code{codes.length !== 1 ? 's' : ''} · {availableCount} available
          </p>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium text-gray-500">Code</th>
                  <th className="px-4 py-2.5 font-medium text-gray-500">Type</th>
                  <th className="px-4 py-2.5 font-medium text-gray-500">Uses</th>
                  <th className="px-4 py-2.5 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2.5 font-medium text-gray-500">Created</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {codes.map(c => {
                  const usedUp = isUsedUp(c)
                  return (
                    <tr key={c.code} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <code className={`font-mono ${usedUp ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {c.code}
                        </code>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            c.type === 'lifetime'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-teal-100 text-teal-700'
                          }`}
                        >
                          {c.type === 'lifetime' ? 'Lifetime' : '1 month'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 tabular-nums">
                        {c.usedCount}/{c.maxUses}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            usedUp ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {usedUp ? 'used up' : 'available'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {!usedUp && (
                          <button
                            onClick={() => copy(c.code)}
                            className="text-gray-400 hover:text-teal-600"
                            title="Copy code"
                          >
                            {copied === c.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
