import type { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, Stethoscope, Cog, HeartHandshake, Coffee, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About: My Story',
  description:
    "Why I built Nursing School Planner: after three semesters of mechanical engineering at the University of Arkansas, I switched to nursing, and used my engineering background to build the planning tool I wished I'd had.",
  alternates: { canonical: 'https://www.nursingschoolplanner.com/about' },
  openGraph: {
    title: 'About Nursing School Planner: My Story',
    description:
      'From mechanical engineering at the University of Arkansas to nursing, and building the tool to make the application process less overwhelming.',
    url: 'https://www.nursingschoolplanner.com/about',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <p className="inline-block text-sm text-teal-700 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-5">
          The story behind Nursing School Planner
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Hi, I&apos;m Nathan 👋</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          I built this site as a student who went through the nursing application gauntlet myself, and I
          decided no one else should have to do it feeling as lost as I did.
        </p>
      </div>

      {/* Story */}
      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Cog className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">I started in mechanical engineering</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            I spent three semesters as a mechanical engineering major at the{' '}
            <strong className="text-gray-900">University of Arkansas</strong>. I loved the problem-solving
            (breaking big, messy problems into clean, solvable pieces), but somewhere along the way I realized
            the work I actually wanted to do was with people, not just systems and equations.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">So I switched to nursing</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Making that leap was the right call, but the application process was a different kind of hard.
            Every school had its own GPA cutoffs, prerequisite lists, entrance exams, and deadlines, scattered
            across a dozen websites that never quite agreed with each other. Figuring out where I actually
            stood (which schools were realistic, what I still needed, and when everything was due) was{' '}
            <strong className="text-gray-900">genuinely overwhelming and stressful</strong>. It felt like the
            hardest part of becoming a nurse had nothing to do with nursing.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">So I built the tool I wish I&apos;d had</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            That engineering brain wouldn&apos;t let it go. I took the same break-it-down approach and pointed
            it at the problem that had stressed me out: I gathered the real requirements for BSN programs,
            built the fit scoring, the gap analysis, the deadline tracking, and the planning tools, and turned
            them into <strong className="text-gray-900">Nursing School Planner</strong>. My goal is simple: so
            the next pre-nursing student can see exactly where they stand and what to do next, without the panic
            I felt.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            If this site saves you even one stressful afternoon, it&apos;s done its job. 💙
          </p>
        </section>
      </div>

      {/* Support CTA */}
      <section className="mt-8 rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-6 sm:p-8 text-center">
        <span className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
          <Coffee className="w-6 h-6" />
        </span>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Support the project</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-5">
          I build and maintain Nursing School Planner on my own, around school. If it helped you, buying me a
          coffee keeps the data fresh and the site running, and means a lot.
        </p>
        <a
          href="https://buymeacoffee.com/Nathan_Connally"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-amber-400 text-amber-950 px-6 py-3 rounded-lg font-semibold hover:bg-amber-300 transition-colors"
        >
          <Coffee className="w-5 h-5" />
          Buy me a coffee
        </a>
      </section>

      {/* Soft nav onward */}
      <div className="mt-8 text-center">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-800"
        >
          Start exploring programs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
