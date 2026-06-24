'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const Schema = z.object({
  programId: z.string().min(1),
  result: z.enum(['admitted', 'waitlisted', 'rejected']),
  overallGPA: z.number().min(0).max(4).nullable().optional(),
  scienceGPA: z.number().min(0).max(4).nullable().optional(),
  examType: z.enum(['TEAS', 'HESI A2', 'NLN PAX']).nullable().optional(),
  examScore: z.number().min(0).max(100).nullable().optional(),
  cycleYear: z.number().int().min(2015).max(2031).nullable().optional(),
})

export type OutcomeInput = z.input<typeof Schema>

/**
 * Records a public, self-reported admission outcome for a program. No account
 * required. Requires at least a GPA or an exam score so the data is useful.
 */
export async function submitOutcome(input: OutcomeInput): Promise<{ ok: boolean; error?: string }> {
  const parsed = Schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please check your entries and try again.' }
  const d = parsed.data

  if (d.overallGPA == null && d.examScore == null) {
    return { ok: false, error: 'Add at least your GPA or your entrance-exam score.' }
  }

  const prog = await prisma.program.findUnique({ where: { id: d.programId }, select: { id: true, urlSlug: true } })
  if (!prog) return { ok: false, error: 'We couldn’t find that program.' }

  try {
    await prisma.outcome.create({
      data: {
        programId: prog.id,
        result: d.result,
        overallGPA: d.overallGPA ?? null,
        scienceGPA: d.scienceGPA ?? null,
        examType: d.examType ?? null,
        examScore: d.examScore ?? null,
        cycleYear: d.cycleYear ?? null,
      },
    })
  } catch (err) {
    console.error('[outcomes] create failed:', err)
    return { ok: false, error: 'Something went wrong saving your outcome. Please try again.' }
  }

  if (prog.urlSlug) revalidatePath(`/programs/${prog.urlSlug}`)
  return { ok: true }
}
