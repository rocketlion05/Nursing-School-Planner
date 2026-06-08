'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Sparkles, X } from 'lucide-react'

const btnClass =
  'inline-flex items-center gap-2 bg-white border border-teal-300 text-teal-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-50 transition-colors'

export default function RequestSchoolButton({ isPremium }: { isPremium: boolean }) {
  const [showPrompt, setShowPrompt] = useState(false)

  if (isPremium) {
    return (
      <Link href="/request-school" className={btnClass}>
        <PlusCircle className="w-4 h-4" />
        Request a school
      </Link>
    )
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setShowPrompt(v => !v)} className={btnClass}>
        <PlusCircle className="w-4 h-4" />
        Request a school
      </button>

      {showPrompt && (
        <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-left">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-gray-900 text-sm">Pro feature</span>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Requesting new schools is included with Pro. Upgrade to submit program requests.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            Go premium
          </Link>
        </div>
      )}
    </div>
  )
}
