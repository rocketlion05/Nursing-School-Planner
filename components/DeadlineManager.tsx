'use client'

import { useState, useTransition } from 'react'
import { CalendarPlus, Pencil, Trash2, Check, X, BellRing } from 'lucide-react'
import { setDeadline, deleteDeadline } from '@/app/actions/deadlines'
import type { DeadlineWithProgram } from '@/app/actions/deadlines'

type ProgramOption = { id: string; university: string; state: string }

type Props = {
  initialDeadlines: DeadlineWithProgram[]
  programs: ProgramOption[]
  /** Server-computed reference date (yyyy-mm-dd) so days-remaining is hydration-stable. */
  todayISO: string
}

function daysBetween(fromISO: string, toISO: string): number {
  const from = Date.parse(`${fromISO}T00:00:00Z`)
  const to = Date.parse(`${toISO}T00:00:00Z`)
  return Math.round((to - from) / 86_400_000)
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function statusFor(days: number): { label: string; cls: string } {
  if (days < 0) return { label: 'Overdue', cls: 'bg-red-100 text-red-700' }
  if (days === 0) return { label: 'Due today', cls: 'bg-red-100 text-red-700' }
  if (days <= 7) return { label: 'Due soon', cls: 'bg-amber-100 text-amber-700' }
  if (days <= 30) return { label: 'Approaching', cls: 'bg-sky-100 text-sky-700' }
  return { label: 'Upcoming', cls: 'bg-green-100 text-green-700' }
}

export default function DeadlineManager({ initialDeadlines, programs, todayISO }: Props) {
  const [deadlines, setDeadlines] = useState<DeadlineWithProgram[]>(initialDeadlines)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Add form
  const [addProgramId, setAddProgramId] = useState('')
  const [addDate, setAddDate] = useState('')
  const [addLabel, setAddLabel] = useState('')

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editLabel, setEditLabel] = useState('')

  function flash(msg: string) {
    setError(msg)
    setTimeout(() => setError(null), 4000)
  }

  const programById = new Map(programs.map(p => [p.id, p]))

  function handleAdd() {
    if (!addProgramId || !addDate) {
      flash('Pick a school and a deadline date.')
      return
    }
    const prog = programById.get(addProgramId)
    if (!prog) return
    startTransition(async () => {
      const res = await setDeadline(addProgramId, addDate, addLabel)
      if (res.error) {
        flash(res.error)
        return
      }
      setDeadlines(prev => {
        const next = prev.filter(d => d.programId !== addProgramId)
        next.push({
          id: prev.find(d => d.programId === addProgramId)?.id ?? `tmp-${addProgramId}`,
          programId: addProgramId,
          university: prog.university,
          programName: '',
          state: prog.state,
          deadlineDate: addDate,
          label: addLabel.trim().slice(0, 80),
          remindersSent: [],
        })
        return next.sort((a, b) => a.deadlineDate.localeCompare(b.deadlineDate))
      })
      setAddProgramId('')
      setAddDate('')
      setAddLabel('')
    })
  }

  function startEdit(d: DeadlineWithProgram) {
    setEditingId(d.id)
    setEditDate(d.deadlineDate)
    setEditLabel(d.label)
  }

  function handleSaveEdit(d: DeadlineWithProgram) {
    if (!editDate) {
      flash('Enter a deadline date.')
      return
    }
    startTransition(async () => {
      const res = await setDeadline(d.programId, editDate, editLabel)
      if (res.error) {
        flash(res.error)
        return
      }
      const movedEarlier = editDate < d.deadlineDate
      setDeadlines(prev =>
        prev
          .map(x =>
            x.id === d.id
              ? { ...x, deadlineDate: editDate, label: editLabel.trim().slice(0, 80), remindersSent: movedEarlier ? [] : x.remindersSent }
              : x,
          )
          .sort((a, b) => a.deadlineDate.localeCompare(b.deadlineDate)),
      )
      setEditingId(null)
    })
  }

  function handleDelete(d: DeadlineWithProgram) {
    startTransition(async () => {
      const res = await deleteDeadline(d.id)
      if (res.error) {
        flash(res.error)
        return
      }
      setDeadlines(prev => prev.filter(x => x.id !== d.id))
    })
  }

  return (
    <div>
      {error && (
        <div className="mb-4 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Add form */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CalendarPlus className="w-4 h-4 text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Add a deadline</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={addProgramId}
            onChange={e => setAddProgramId(e.target.value)}
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select a school…</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>
                {p.university} ({p.state})
              </option>
            ))}
          </select>
          <input
            type="date"
            value={addDate}
            onChange={e => setAddDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            value={addLabel}
            onChange={e => setAddLabel(e.target.value)}
            placeholder="Label (optional)"
            maxLength={80}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleAdd}
            disabled={isPending}
            className="shrink-0 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      {deadlines.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-xl">
          <CalendarPlus className="w-8 h-8 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No deadlines yet. Add one above to start tracking.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="p-3 font-medium text-gray-500">School</th>
                <th className="p-3 font-medium text-gray-500">Deadline</th>
                <th className="p-3 font-medium text-gray-500">Days remaining</th>
                <th className="p-3 font-medium text-gray-500">Status</th>
                <th className="p-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deadlines.map(d => {
                const days = daysBetween(todayISO, d.deadlineDate)
                const status = statusFor(days)
                const editing = editingId === d.id
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <span className="font-medium text-gray-900">{d.university}</span>
                      <span className="text-gray-400 ml-1.5 text-xs">{d.state}</span>
                      {d.label && !editing && <p className="text-xs text-gray-500 mt-0.5">{d.label}</p>}
                      {editing && (
                        <input
                          type="text"
                          value={editLabel}
                          onChange={e => setEditLabel(e.target.value)}
                          placeholder="Label (optional)"
                          maxLength={80}
                          className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="p-3 text-gray-600">
                      {editing ? (
                        <input
                          type="date"
                          value={editDate}
                          onChange={e => setEditDate(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      ) : (
                        formatDate(d.deadlineDate)
                      )}
                    </td>
                    <td className="p-3 text-gray-600 tabular-nums">
                      {days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? 'Today' : `${days} days`}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
                      {d.remindersSent.length > 0 && (
                        <span
                          className="ml-1.5 inline-flex items-center gap-0.5 text-xs text-gray-400"
                          title={`Reminders sent: ${d.remindersSent.join(', ')} days out`}
                        >
                          <BellRing className="w-3 h-3" />
                          {d.remindersSent.length}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {editing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(d)}
                              disabled={isPending}
                              title="Save"
                              className="p-1.5 rounded-md text-teal-600 hover:bg-teal-50 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              title="Cancel"
                              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(d)}
                              title="Edit"
                              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(d)}
                              disabled={isPending}
                              title="Delete"
                              className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
