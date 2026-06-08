'use client'

import { useActionState } from 'react'
import { sendContactMessage } from '@/app/actions/contact'
import type { ContactFormState } from '@/app/lib/contact-validation'
import { Send, CheckCircle } from 'lucide-react'

const input =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactFormState, FormData>(sendContactMessage, undefined)

  if (state?.ok) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h2 className="font-semibold text-gray-900 mb-1">Message sent!</h2>
        <p className="text-sm text-gray-500">
          Thanks for reaching out — we&apos;ll get back to you by email as soon as we can.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input id="name" name="name" className={input} defaultValue={state?.values?.name} placeholder="Your name" />
          {state?.errors?.name && <p className="text-xs text-red-600">{state.errors.name[0]}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={input}
            defaultValue={state?.values?.email}
            placeholder="you@email.com"
            autoComplete="email"
          />
          {state?.errors?.email && <p className="text-xs text-red-600">{state.errors.email[0]}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          className={input}
          defaultValue={state?.values?.subject}
          placeholder="What's this about?"
        />
        {state?.errors?.subject && <p className="text-xs text-red-600">{state.errors.subject[0]}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={`${input} min-h-32 resize-y`}
          defaultValue={state?.values?.message}
          placeholder="How can we help?"
        />
        {state?.errors?.message && <p className="text-xs text-red-600">{state.errors.message[0]}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        <Send className="w-4 h-4" />
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
