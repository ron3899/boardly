'use client'

import { useState, useRef, useEffect } from 'react'

interface DropdownCellProps {
  value: unknown
  onChange: (value: unknown) => void
  settings: Record<string, unknown>
}

export function DropdownCell({ value, onChange, settings }: DropdownCellProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const options = (settings?.options || []) as string[]
  const selected = typeof value === 'string' ? value : null

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-8 px-2 flex items-center text-sm text-foreground rounded hover:bg-muted/50"
      >
        {selected || <span className="text-muted-foreground">-</span>}
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-popover border border-border text-popover-foreground rounded-md shadow-md dark:shadow-black/30 p-1 min-w-[140px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className="w-full px-2 py-1.5 text-sm text-left rounded hover:bg-muted"
            >
              {opt}
            </button>
          ))}
          <button
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
            className="w-full px-2 py-1.5 text-sm text-muted-foreground text-left rounded hover:bg-muted"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
