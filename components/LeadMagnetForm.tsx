'use client'

import { useState } from 'react'
import { Download, Mail, CheckCircle, Loader2 } from 'lucide-react'
import { subscribeToLeadMagnet } from '@/app/actions/leads'

export default function LeadMagnetForm({ source = 'free-checklist' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [downloadPath, setDownloadPath] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading'); setError(null)
    const res = await subscribeToLeadMagnet(email, source)
    if (!res.ok) { setError(res.error ?? 'Something went wrong. Please try again.'); setStatus('error'); return }
    setDownloadPath(res.downloadPath ?? null)
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="font-semibold text-gray-900">Check your inbox!</p>
        <p className="text-sm text-gray-600 mt-1">We emailed your checklist. You can also download it now:</p>
        {downloadPath && (
          <a
            href={downloadPath}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 mt-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            <Download className="w-4 h-4" /> Download the checklist (PDF)
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-5">
      <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
        Where should we send it?
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="lead-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Get the free checklist
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <p className="text-xs text-gray-400 mt-2">Free. No spam — just the checklist and the occasional helpful nursing-school tip.</p>
    </form>
  )
}
