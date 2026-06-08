import Image from 'next/image'
import Link from 'next/link'
import ResetPasswordForm from '@/components/ResetPasswordForm'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <Image
          src="/logo.jpg"
          alt="Nursing School Planner"
          width={96}
          height={96}
          priority
          className="w-20 h-20 mx-auto mb-4 rounded-xl"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Choose a new password</h1>

        {token ? (
          <>
            <p className="text-gray-500 text-sm mb-6">
              Pick a strong password you don&apos;t use anywhere else.
            </p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <div className="text-sm text-gray-600">
            <p className="mb-4">
              This reset link is missing its token or is malformed. Reset links expire after 1 hour —
              please request a fresh one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
