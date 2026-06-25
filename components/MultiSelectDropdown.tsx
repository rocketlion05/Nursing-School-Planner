'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import clsx from 'clsx'

type Option = { value: string; label: string }

/**
 * A dropdown that lets the user pick multiple options via checkboxes in a popover
 * (unlike a native <select multiple>, which renders as an always-open listbox).
 * Closed-state button shows a summary of the current selection.
 */
export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = 'Select…',
  noun = 'selected',
}: {
  options: Option[]
  selected: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  /** Word used in the "3 noun" summary when more than two are picked. */
  noun?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouse(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value])
  }

  const labelFor = (v: string) => options.find(o => o.value === v)?.label ?? v
  const summary =
    selected.length === 0
      ? placeholder
      : selected.length <= 2
        ? selected.map(labelFor).join(', ')
        : `${selected.length} ${noun}`

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <span className={clsx('truncate', selected.length === 0 && 'text-gray-400')}>{summary}</span>
        <ChevronDown className={clsx('w-4 h-4 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg py-1"
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400">No options available.</p>
          ) : (
            options.map(o => {
              const checked = selected.includes(o.value)
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(o.value)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={clsx(
                      'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                      checked ? 'bg-teal-600 border-teal-600' : 'border-gray-300',
                    )}
                  >
                    {checked && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span className={checked ? 'text-gray-900 font-medium' : 'text-gray-700'}>{o.label}</span>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
