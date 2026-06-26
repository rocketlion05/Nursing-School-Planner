import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getCurrentUser } from '@/app/lib/dal'
import { getProfile } from '@/app/actions/profile'
import { getAllPrograms } from '@/lib/programs'
import { scorePrograms, computeGapSummary } from '@/lib/gap'
import { AI_PLAN_MODEL, AI_ADVISOR_SYSTEM_PROMPT, buildAdvisorContext } from '@/lib/ai-plan'

export const dynamic = 'force-dynamic'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null
  const msgs: ChatMessage[] = []
  for (const m of input) {
    if (!m || typeof m !== 'object') continue
    const role = (m as { role?: unknown }).role
    const content = (m as { content?: unknown }).content
    if ((role === 'user' || role === 'assistant') && typeof content === 'string' && content.trim()) {
      msgs.push({ role, content: content.slice(0, 2000) })
    }
  }
  // Keep the most recent turns only; require the last message to be from the user.
  const trimmed = msgs.slice(-12)
  if (trimmed.length === 0 || trimmed[trimmed.length - 1].role !== 'user') return null
  return trimmed
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 })

  const profile = await getProfile()
  if (!profile) return NextResponse.json({ error: 'Complete your profile first.' }, { status: 400 })
  if (profile.tier !== 'cycle') {
    return NextResponse.json(
      {
        error: profile.cyclePassExpired
          ? 'Your cycle pass has expired. Repurchase for your next cycle.'
          : 'The AI Academic Advisor is a Pro feature.',
      },
      { status: 403 },
    )
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'AI advising is not configured yet (missing OPENAI_API_KEY).' }, { status: 503 })
  }

  const json = await req.json().catch(() => null)
  const messages = sanitizeMessages(json?.messages)
  if (!messages) return NextResponse.json({ error: 'Invalid message history.' }, { status: 400 })

  const programs = await getAllPrograms()
  const scored = scorePrograms(profile, programs)
  const gap = computeGapSummary(profile, scored)
  const context = buildAdvisorContext(profile, scored, gap)

  const client = new OpenAI()
  const stream = await client.chat.completions.create({
    model: AI_PLAN_MODEL,
    max_tokens: 900,
    stream: true,
    messages: [
      { role: 'system', content: AI_ADVISOR_SYSTEM_PROMPT },
      { role: 'system', content: context },
      ...messages,
    ],
  })

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content
          if (text) controller.enqueue(encoder.encode(text))
        }
      } catch (err) {
        console.error('advisor stream error:', err)
        controller.enqueue(encoder.encode('\n\n[Sorry, I had trouble answering. Please try again.]'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
