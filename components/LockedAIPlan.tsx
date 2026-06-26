import Link from 'next/link'
import { Sparkles, Lock } from 'lucide-react'

/** Blurred teaser of the AI plan shown to free-tier users, with an upgrade CTA. */
export default function LockedAIPlan() {
  return (
    <section className="relative bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-200 p-6 mb-8 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-bold text-gray-900">AI Academic Advisor</h2>
      </div>

      {/* Blurred faux content */}
      <div className="select-none blur-sm pointer-events-none" aria-hidden="true">
        <h3 className="font-semibold text-gray-900 mt-2">Top priorities right now</h3>
        <div className="space-y-1.5 text-sm text-gray-700 mt-1">
          <p>1. Register for Anatomy &amp; Physiology II and Microbiology this spring.</p>
          <p>2. Schedule your TEAS for early next term and aim for 80%+.</p>
          <p>3. Request transcripts and start your application for UAMS by January 15.</p>
        </div>
        <h3 className="font-semibold text-gray-900 mt-3">Fall semester</h3>
        <p className="text-sm text-gray-700 mt-1">
          Take General Chemistry and Statistics to round out your science prerequisites,
          keep your science GPA above 3.2, and begin shadowing hours to strengthen your
          application narrative for your target programs.
        </p>
        <h3 className="font-semibold text-gray-900 mt-3">Spring semester</h3>
        <p className="text-sm text-gray-700 mt-1">
          Retake the HESI A2 if needed, finalize recommendation letters, and submit
          applications to your Match and Safe schools ahead of their deadlines.
        </p>
      </div>

      {/* Lock overlay + CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-[2px] px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 max-w-sm">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Unlock your AI advisor</h3>
          <p className="text-sm text-gray-500 mb-4">
            Chat with an AI academic advisor that knows your stats and our program data. Ask it to
            build your plan, pick your best-fit schools, or answer any application question.
          </p>
          <Link
            href="/pricing"
            className="inline-block w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Upgrade to Pro to unlock your AI advisor
          </Link>
        </div>
      </div>
    </section>
  )
}
