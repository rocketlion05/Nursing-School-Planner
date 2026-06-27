'use client'

import { useState, useTransition } from 'react'
import { Users, ChevronDown } from 'lucide-react'
import { listUsers, type AdminUserRow } from '@/app/actions/admin'

/** "View users" toggle that loads the full user list (username, email, join date) on demand. */
export default function AdminUsersList() {
  const [rows, setRows] = useState<AdminUserRow[] | null>(null)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function toggle() {
    if (open) { setOpen(false); return }
    if (rows) { setOpen(true); return }
    startTransition(async () => {
      const data = await listUsers()
      setRows(data)
      setOpen(true)
    })
  }

  return (
    <div className="mt-4">
      <button
        onClick={toggle}
        disabled={pending}
        className="inline-flex items-center gap-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        <Users className="w-4 h-4 text-gray-500" />
        {pending ? 'Loading…' : open ? 'Hide users' : 'View users'}
        {!pending && <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>

      {open && rows && (
        <div className="mt-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500">
            {rows.length} user{rows.length === 1 ? '' : 's'}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium text-gray-500">Username</th>
                  <th className="px-4 py-2.5 font-medium text-gray-500">Email</th>
                  <th className="px-4 py-2.5 font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{u.username}</td>
                    <td className="px-4 py-2.5 text-gray-600">{u.email}</td>
                    <td className="px-4 py-2.5 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
