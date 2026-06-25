import type { Metadata } from 'next'
import { getProfile } from '@/app/actions/profile'

export const metadata: Metadata = {
  title: 'My Profile',
  robots: { index: false, follow: false },
}
import { requireUser } from '@/app/lib/dal'
import { getAllPrograms } from '@/lib/programs'
import { STATE_NAMES } from '@/lib/states'
import { availableTargetTerms } from '@/lib/cycle'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const [user, profile, programs] = await Promise.all([requireUser(), getProfile(), getAllPrograms()])

  // State-preference options = every state we actually have programs in (auto-grows).
  const stateOptions = Array.from(new Set(programs.map(p => p.state)))
    .map(code => ({ code, label: STATE_NAMES[code] ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label))

  // Target-term options are computed live so past terms drop off automatically.
  const termOptions = availableTargetTerms(new Date())

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">
          Enter your academic stats to see how you compare to BSN program requirements.
        </p>
      </div>
      <ProfileForm initialProfile={profile} userEmail={user.email} stateOptions={stateOptions} termOptions={termOptions} />
    </div>
  )
}
