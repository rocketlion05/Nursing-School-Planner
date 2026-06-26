'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import Markdown from '@/components/Markdown'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'Build me an academic plan',
  'What schools are my best options?',
  'How can I improve my chances?',
  'What should I do before I apply?',
]

export default function AIAdvisor({ studentName }: { studentName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const firstName = studentName?.split(' ')[0]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    const content = text.trim()
    if (!content || streaming) return
    track('advisor_message', {})
    const history = [...messages, { role: 'user', content } as ChatMessage]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    const setLast = (c: string) =>
      setMessages(m => { const copy = [...m]; copy[copy.length - 1] = { role: 'assistant', content: c }; return copy })

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        setLast(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setLast(acc)
      }
    } catch {
      setLast('Network error while reaching your advisor. Please try again.')
    } finally {
      setStreaming(false)
    }
  }

  const empty = messages.length === 0

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-200 p-5 sm:p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-bold text-gray-900">AI Academic Advisor</h2>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="max-h-[28rem] overflow-y-auto space-y-4 pr-1">
        {empty ? (
          <div className="text-sm text-gray-600">
            <p className="mb-3">
              Hi{firstName ? ` ${firstName}` : ''}! I&apos;m your nursing-school advisor. Ask me anything about your
              path to a BSN, or start with one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-sm text-left bg-white border border-teal-200 text-teal-800 hover:bg-teal-100 rounded-full px-3 py-1.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <div className="bg-teal-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[85%] text-sm whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[92%] text-sm text-gray-800">
                  {m.content ? (
                    <Markdown body={m.content} />
                  ) : (
                    <span className="inline-flex items-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                    </span>
                  )}
                </div>
              </div>
            ),
          )
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); send(input) }}
        className="mt-4 flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
          rows={1}
          placeholder="Ask your advisor anything… (e.g. “What classes should I take next semester?”)"
          className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 max-h-32"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="shrink-0 inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-3">
        AI guidance based on your profile and our program data. Always confirm requirements and deadlines with each school.
      </p>
    </section>
  )
}
