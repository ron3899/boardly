'use client'

import { useState, useRef, useEffect } from 'react'
import type { BoardMember, User } from '@boardly/shared'

interface PersonCellProps {
  value: unknown
  onChange: (value: unknown) => void
  members: (BoardMember & { user: Pick<User, 'id' | 'name' | 'email'> })[]
}

export function PersonCell({ value, onChange, members }: PersonCellProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selectedUserId = typeof value === 'string' ? value : null
  const selectedMember = members.find((m) => m.user.id === selectedUserId)

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
        {selectedMember ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              {selectedMember.user.name.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{selectedMember.user.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-popover border border-border text-popover-foreground rounded-md shadow-md dark:shadow-black/30 p-1 min-w-[160px]">
          {members.map((m) => (
            <button
              key={m.user.id}
              onClick={() => {
                onChange(m.user.id)
                setOpen(false)
              }}
              className="w-full px-2 py-1.5 flex items-center gap-2 text-sm rounded hover:bg-muted"
            >
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                {m.user.name.charAt(0).toUpperCase()}
              </div>
              {m.user.name}
            </button>
          ))}
          <button
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
            className="w-full px-2 py-1.5 text-sm text-muted-foreground rounded hover:bg-muted"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
