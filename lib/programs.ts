import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ProgramData } from '@/types'
import verificationLog from '@/prisma/verification-log.json'

// slug -> ISO timestamp of the last recorded re-verification against official sources.
const VLOG = verificationLog as Record<string, string>

/**
 * All programs, cached in the Vercel Data Cache so the heavy ~100-row Turso query
 * isn't re-run on every request. The research agents reseed the prod DB weekly
 * WITHOUT a code change, and a reseed does NOT bust this cache on its own — so the
 * revalidate window is the max staleness after new schools land. A short window
 * (~2 min) keeps new schools/edits showing up promptly while stale-while-revalidate
 * keeps TTFB fast (users get the cached copy instantly; the DB requery happens in
 * the background). Bump the version in the key (`all-programs-vN`) to force an
 * immediate refresh on a deploy. User-specific scoring stays per-request.
 */
export const getAllPrograms = unstable_cache(
  async (): Promise<ProgramData[]> => {
    const rows = await prisma.program.findMany({ orderBy: [{ state: 'asc' }, { university: 'asc' }] })
    return rows.map(p => ({
      ...p,
      requiredCourses: JSON.parse(p.requiredCourses) as string[],
      estimatedFields: JSON.parse(p.estimatedFields) as string[],
      lastVerifiedAt: (p.slug && VLOG[p.slug]) || null,
    }))
  },
  ['all-programs-v2'],
  { revalidate: 120, tags: ['programs'] },
)
