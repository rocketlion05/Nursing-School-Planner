'use client'

import { useState, useRef, useEffect } from 'react'
import { ListPlus, Check, Plus } from 'lucide-react'

export type NamedListOption = { id: string; name: string; hasProgram: boolean }

type Props = {
  lists: NamedListOption[]
  disabled?: boolean
  onToggleList: (listId: string, shouldAdd: boolean) => void
  onCreateList: (name: string) => void
}

/**
 * Premium "Add to list" popover shown beside the favorite heart on /programs.
 * Lets a user toggle a program in/out of their named lists and create a new one
 * inline. The default "Saved" list is managed by the heart, not here.
 */
export default function AddToListButton({ lists, disabled, onToggleList, onCreateList }: Props) {
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const inCount = lists.filter(l => l.hasProgram).length

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    onCreateList(name)
    setNewName('')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        disabled={disabled}
        title="Add to a list"
        className={`shrink-0 flex items-center gap-1 text-xs rounded-md p-2 transition-colors disabled:opacity-50 ${
          inCount > 0 ? 'text-teal-600 hover:text-teal-800' : 'text-gray-300 hover:text-teal-500'
        }`}
      >
        <ListPlus className="w-4 h-4" />
        {inCount > 0 && <span className="tabular-nums">{inCount}</span>}
      </button>

      {open && (
        <div className="absolute z-20 right-0 mt-1 w-60 bg-white border border-gray-200 rounded-xl shadow-lg p-2">
          <p className="text-xs font-medium text-gray-400 px-2 pt-1 pb-1.5">Add to list</p>
          <div className="max-h-48 overflow-y-auto">
            {lists.length === 0 ? (
              <p className="text-xs text-gray-400 px-2 py-2">No custom lists yet. Create one below.</p>
            ) : (
              lists.map(l => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onToggleList(l.id, !l.hasProgram)}
                  className="w-full flex items-center gap-2 text-left text-sm px-2 py-1.5 rounded-md hover:bg-gray-50"
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      l.hasProgram ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300'
                    }`}
                  >
                    {l.hasProgram && <Check className="w-3 h-3" />}
                  </span>
                  <span className="truncate text-gray-700">{l.name}</span>
                </button>
              ))
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCreate()
                }
              }}
              placeholder="New list name…"
              maxLength={60}
              className="flex-1 min-w-0 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleCreate}
              title="Create list"
              className="shrink-0 bg-teal-600 text-white rounded-md p-1.5 hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
