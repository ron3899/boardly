'use client'

import { useState, useRef, useEffect } from 'react'

interface StatusCellProps {
  value: unknown
  onChange: (value: unknown) => void
  settings: Record<string, unknown>
}

export function StatusCell({ value, onChange, settings }: StatusCellProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const labels = (settings?.labels || {}) as Record<string, { color: string; label: string }>
  const current = typeof value === 'string' ? value : null

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const currentLabel = current ? labels[current] : null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-8 rounded text-xs font-medium flex items-center justify-center"
        style={{
          backgroundColor: currentLabel?.color || '#c4c4c4',
          color: '#fff',
        }}
      >
        {currentLabel?.label || 'Select'}
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-popover border rounded-md shadow-md p-1 min-w-[140px]">
          {Object.entries(labels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                onChange(key)
                setOpen(false)
              }}
              className="w-full h-7 rounded text-xs font-medium mb-1 last:mb-0"
              style={{ backgroundColor: label.color, color: '#fff' }}
            >
              {label.label}
            </button>
          ))}
          <button
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
            className="w-full h-7 rounded text-xs text-muted-foreground hover:bg-accent"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
