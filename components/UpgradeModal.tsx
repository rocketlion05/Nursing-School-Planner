'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  /** One-sentence explanation of what the free user is missing. */
  message: string
  /** CTA label; defaults to a Cycle Pass upgrade. */
  ctaLabel?: string
}

/**
 * Friendly upgrade prompt shown when a free user hits a paid gate (e.g. the
 * 2-favorite limit or the 2-school comparison cap). Always offers a clear
 * Upgrade button that links to /pricing.
 */
export default function UpgradeModal({ open, onClose, title, message, ctaLabel = 'Upgrade to Cycle Pass' }: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 id="upgrade-modal-title" className="text-lg font-bold text-gray-900 mb-1.5">
          {title}
        </h2>
        <p className="text-sm text-gray-500 mb-5">{message}</p>

        <Link
          href="/pricing"
          className="block w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          {ctaLabel}
        </Link>
        <button
          onClick={onClose}
          className="mt-2 w-full text-sm text-gray-400 hover:text-gray-600 py-1"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
