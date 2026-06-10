import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'TEAS & HESI Study Tools',
  description:
    'Free resources and prep guides for the TEAS and HESI A2 nursing entrance exams. Practice questions, score breakdowns, and study strategies for pre-nursing students.',
  alternates: { canonical: 'https://www.nursingschoolplanner.com/study-tools' },
  openGraph: {
    title: 'TEAS & HESI Study Tools — Nursing School Planner',
    description: 'Free prep resources for the TEAS and HESI A2 nursing entrance exams.',
    url: 'https://www.nursingschoolplanner.com/study-tools',
    type: 'website',
  },
}
import { ExternalLink, PlayCircle, BookOpen } from 'lucide-react'

const SECTIONS = [
  {
    id: 'teas',
    label: 'TEAS',
    fullName: 'ATI TEAS 7',
    color: 'teal',
    description:
      'The TEAS (Test of Essential Academic Skills) is the most widely required nursing school entrance exam. It tests reading, math, science, and English language usage.',
    books: [
      { href: 'https://amzn.to/4ekwXDC', title: 'ATI TEAS Study Guide', subtitle: 'Comprehensive content review + practice questions' },
      { href: 'https://amzn.to/4o1n6G4', title: 'ATI TEAS Practice Tests', subtitle: 'Full-length practice exams with detailed explanations' },
    ],
    videos: [
      {
        title: "Master The ATI TEAS Exam With Nurse Cheung's Ultimate Study Guide!",
        channel: 'Nurse Cheung',
        href: 'https://www.youtube.com/results?search_query=Master+The+ATI+TEAS+Exam+Nurse+Cheung+Ultimate+Study+Guide',
      },
    ],
  },
  {
    id: 'hesi',
    label: 'HESI A2',
    fullName: 'HESI A2',
    color: 'blue',
    description:
      'The HESI A2 is another common nursing school entrance exam. It covers anatomy, biology, chemistry, reading comprehension, vocabulary, math, and grammar.',
    books: [
      { href: 'https://amzn.to/4fWXcRR', title: 'HESI A2 Study Guide', subtitle: 'Complete subject-by-subject content review' },
      { href: 'https://amzn.to/49DMhIW', title: 'HESI A2 Practice Tests', subtitle: 'Realistic practice exams with answer explanations' },
    ],
    videos: [
      {
        title: 'Nurse Shai — HESI A2 Tips, Study Strategies & More',
        channel: 'Nurse Shai',
        href: 'https://www.youtube.com/results?search_query=Nurse+Shai+HESI+A2',
      },
    ],
  },
  {
    id: 'casper',
    label: 'CASPer',
    fullName: 'CASPer',
    color: 'purple',
    description:
      'CASPer (Computer-Based Assessment for Sampling Personal Characteristics) is a situational judgement test used by select nursing programs to assess communication and professionalism.',
    books: [
      { href: 'https://amzn.to/3Shwrxz', title: 'CASPer Preparation Guide', subtitle: 'Scenario-based practice with sample responses' },
    ],
    videos: [
      {
        title: 'How to Ace the CASPer Test — Sample Questions and Answers Included',
        channel: 'YouTube',
        href: 'https://www.youtube.com/results?search_query=How+to+Ace+the+CASPer+Test+Sample+Questions+Answers',
      },
      {
        title: 'How to Prepare for CASPer in 6 Steps (Including Sample Questions!)',
        channel: 'YouTube',
        href: 'https://www.youtube.com/results?search_query=How+to+Prepare+for+CASPer+6+Steps+Sample+Questions',
      },
    ],
  },
]

const SECTION_STYLES: Record<string, { badge: string; bookCard: string; videoCard: string; icon: string }> = {
  teal: {
    badge: 'bg-teal-100 text-teal-700',
    bookCard: 'border-teal-100 hover:border-teal-300',
    videoCard: 'bg-teal-50 border-teal-100 hover:border-teal-300',
    icon: 'text-teal-600',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-700',
    bookCard: 'border-blue-100 hover:border-blue-300',
    videoCard: 'bg-blue-50 border-blue-100 hover:border-blue-300',
    icon: 'text-blue-600',
  },
  purple: {
    badge: 'bg-purple-100 text-purple-700',
    bookCard: 'border-purple-100 hover:border-purple-300',
    videoCard: 'bg-purple-50 border-purple-100 hover:border-purple-300',
    icon: 'text-purple-600',
  },
}

export default function StudyToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Study Tools & Resources</h1>
        <p className="text-gray-500 mt-1">
          Handpicked study guides and videos for the three exams you&apos;ll most likely need for BSN admission.
        </p>
      </div>

      {/* Jump links */}
      <div className="flex gap-2 mb-8">
        {SECTIONS.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold ${SECTION_STYLES[s.color].badge}`}
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {SECTIONS.map(section => {
          const styles = SECTION_STYLES[section.color]
          return (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${styles.badge}`}>
                  {section.label}
                </span>
                <h2 className="text-xl font-bold text-gray-900">{section.fullName}</h2>
              </div>
              <p className="text-gray-600 text-sm mb-5">{section.description}</p>

              {/* Study guides */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className={`w-4 h-4 ${styles.icon}`} />
                  <h3 className="font-semibold text-gray-800 text-sm">Recommended Study Guides</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {section.books.map(book => (
                    <Link
                      key={book.href}
                      href={book.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-start gap-3 bg-white border rounded-xl p-4 transition-colors ${styles.bookCard}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{book.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{book.subtitle}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* YouTube videos */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PlayCircle className={`w-4 h-4 ${styles.icon}`} />
                  <h3 className="font-semibold text-gray-800 text-sm">YouTube Resources</h3>
                </div>
                <div className="space-y-2">
                  {section.videos.map(video => (
                    <Link
                      key={video.href}
                      href={video.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${styles.videoCard}`}
                    >
                      <PlayCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">{video.title}</p>
                        {video.channel !== 'YouTube' && (
                          <p className="text-xs text-gray-500 mt-0.5">{video.channel}</p>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Affiliate disclosure */}
      <p className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-4">
        Some links above are affiliate links. If you purchase through them, we may earn a small commission at no extra cost to you. We only link to resources we believe are genuinely helpful for exam prep.
      </p>
    </div>
  )
}
