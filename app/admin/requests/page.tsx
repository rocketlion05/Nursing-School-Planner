import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Admin — School Requests',
  robots: { index: false, follow: false },
}
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'
import { getSubscriberStats } from '@/app/actions/admin'
import AdminRefreshButton from '@/components/AdminRefreshButton'
import { updateRequestStatus } from './actions'
import { Users, TrendingUp, Calendar, CalendarDays } from 'lucide-react'

function isAdmin(userEmail: string | undefined, secret: string | undefined): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  return (!!adminSecret && secret === adminSecret) || isAdminEmail(userEmail)
}

const STATUS_OPTIONS = ['new', 'in_progress', 'added', 'wont_add']
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  added: 'bg-green-100 text-green-700',
  wont_add: 'bg-red-100 text-red-600',
  pending: 'bg-amber-100 text-amber-700',
  fulfilled: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>
}) {
  const { secret } = await searchParams
  const user = await getCurrentUser()

  if (!isAdmin(user?.email, secret)) notFound()

  const [requests, stats] = await Promise.all([
    prisma.schoolRequest.findMany({ orderBy: { createdAt: 'desc' } }),
    getSubscriberStats(),
  ])

  // Fetch user emails for display
  const userIds = [...new Set(requests.map(r => r.requestedBy).filter(Boolean))] as string[]
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, username: true },
  })
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))

  const passedSecret = secret ?? ''

  const mrr = stats ? `$${(stats.mrrCents / 100).toFixed(2)}` : '—'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">School requests &amp; subscriber overview</p>
        </div>
        <AdminRefreshButton />
      </div>

      {/* Subscriber stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Monthly</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.monthly ?? '—'}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Yearly</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.yearly ?? '—'}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Pro</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total ?? '—'}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Est. MRR</p>
            <p className="text-2xl font-bold text-gray-900">{mrr}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">School Requests</h2>
        <p className="text-gray-500 text-sm mt-0.5">{requests.length} total requests</p>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-400 text-sm">No requests yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-gray-500">School</th>
                <th className="px-4 py-3 font-medium text-gray-500">Location</th>
                <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500">Requested by</th>
                <th className="px-4 py-3 font-medium text-gray-500">Submitted</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(r => {
                const reqUser = r.requestedBy ? userMap[r.requestedBy] : null
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{r.schoolName}</p>
                      <p className="text-gray-400 text-xs">{r.university}</p>
                      {r.reason && <p className="text-gray-500 text-xs mt-1 italic">&ldquo;{r.reason}&rdquo;</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.city ? `${r.city}, ` : ''}{r.state}</td>
                    <td className="px-4 py-3 text-gray-600">{r.programType}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {reqUser ? (
                        <>
                          <span className="block">{reqUser.email}</span>
                          <span className="text-gray-400">@{reqUser.username}</span>
                        </>
                      ) : r.requestedBy ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
                          {r.status.replace('_', ' ')}
                        </span>
                        <form action={async (fd: FormData) => {
                          'use server'
                          const newStatus = fd.get('status') as string
                          const sec = fd.get('secret') as string
                          await updateRequestStatus(r.id, newStatus, sec)
                        }}>
                          <input type="hidden" name="secret" value={passedSecret} />
                          <select
                            name="status"
                            defaultValue={r.status}
                            className="text-xs border border-gray-300 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="ml-1 text-xs bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700 transition-colors"
                          >
                            Save
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
