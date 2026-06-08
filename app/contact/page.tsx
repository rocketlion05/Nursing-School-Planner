import ContactForm from '@/components/ContactForm'
import { Mail } from 'lucide-react'

export const metadata = {
  title: 'Contact Us — Nursing School Planner',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-1">
          Questions, feedback, or found a bug? Send us a message and we&apos;ll reply by email.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <ContactForm />
      </div>
    </div>
  )
}
