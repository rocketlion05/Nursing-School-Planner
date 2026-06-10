import type { Metadata } from 'next'
import { getProfile } from '@/app/actions/profile'

export const metadata: Metadata = {
  title: 'My Profile',
  robots: { index: false, follow: false },
}
import { requireUser } from '@/app/lib/dal'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const user = await requireUser()
  const profile = await getProfile()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">
          Enter your academic stats to see how you compare to BSN program requirements.
        </p>
      </div>
      <ProfileForm initialProfile={profile} userEmail={user.email} />
    </div>
  )
}
