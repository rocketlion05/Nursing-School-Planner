import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ProgramData } from '@/types'
import verificationLog from '@/prisma/verification-log.json'

// slug -> ISO timestamp of the last recorded re-verification against official sources.
const VLOG = verificationLog as Record<string, string>

/**
 * All programs, cached in the Vercel Data Cache so the heavy ~100-row Turso query
 * isn't re-run on every request. Program/requirement data changes only when the
 * research agents reseed + redeploy (which busts the cache), so a 1-hour
 * revalidate is plenty fresh. User-specific scoring stays per-request.
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
  ['all-programs'],
  { revalidate: 3600, tags: ['programs'] },
)
