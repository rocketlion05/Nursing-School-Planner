import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/dal'
import ForgotPasswordForm from '@/components/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  if (await getCurrentUser()) redirect('/dashboard')

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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot your password?</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter the email on your account and we&apos;ll send you a link to reset your password.
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}
