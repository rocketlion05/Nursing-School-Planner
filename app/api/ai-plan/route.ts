import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { getProfile } from '@/app/actions/profile'
import { scorePrograms, computeGapSummary } from '@/lib/gap'
import { AI_PLAN_MODEL, AI_PLAN_SYSTEM_PROMPT, buildPlanContext } from '@/lib/ai-plan'
import type { ProgramData } from '@/types'

// Always run fresh — the plan depends on the latest profile + favorites.
export const dynamic = 'force-dynamic'

export async function POST() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Please log in.' }, { status: 401 })
  }

  const profile = await getProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Complete your profile first.' }, { status: 400 })
  }

  // Cycle Pass only (admins report tier 'cycle' via getProfile()).
  if (profile.tier !== 'cycle') {
    return NextResponse.json(
      { error: 'The AI Application Plan is a Cycle Pass feature.' },
      { status: 403 },
    )
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'AI planning is not configured yet (missing OPENAI_API_KEY).' },
      { status: 503 },
    )
  }

  // Gather context: all programs (for the fit summary) + the student's favorites.
  const [rawPrograms, favoriteRows] = await Promise.all([
    prisma.program.findMany({ orderBy: [{ state: 'asc' }, { university: 'asc' }] }),
    prisma.favorite.findMany({
      where: { profile: { userId: user.id } },
      include: { program: true },
    }),
  ])

  const toProgramData = (p: (typeof rawPrograms)[number]): ProgramData => ({
    ...p,
    requiredCourses: JSON.parse(p.requiredCourses) as string[],
  })

  const programs = rawPrograms.map(toProgramData)
  const favoriteIds = new Set(favoriteRows.map(f => f.programId))
  const scored = scorePrograms(profile, programs, favoriteIds)
  const gap = computeGapSummary(profile, scored)
  const favorites = scored.filter(p => favoriteIds.has(p.id))

  const context = buildPlanContext(profile, favorites, gap)

  const client = new OpenAI()

  const stream = await client.chat.completions.create({
    model: AI_PLAN_MODEL,
    max_tokens: 1200,
    stream: true,
    messages: [
      { role: 'system', content: AI_PLAN_SYSTEM_PROMPT },
      { role: 'user', content: context },
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
        console.error('ai-plan stream error:', err)
        controller.enqueue(
          encoder.encode('\n\n[Sorry — the plan could not be generated. Please try again.]'),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
