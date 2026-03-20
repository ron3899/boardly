'use client'

import { useState } from 'react'

interface NumberCellProps {
  value: unknown
  onChange: (value: unknown) => void
}

export function NumberCell({ value, onChange }: NumberCellProps) {
  const [editing, setEditing] = useState(false)
  const numValue = typeof value === 'number' ? value : null
  const [text, setText] = useState(numValue !== null ? String(numValue) : '')

  const save = () => {
    setEditing(false)
    const num = text === '' ? null : Number(text)
    if (num !== numValue && (num === null || !isNaN(num))) {
      onChange(num)
    }
  }

  if (editing) {
    return (
      <input
        type="number"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') {
            setText(numValue !== null ? String(numValue) : '')
            setEditing(false)
          }
        }}
        className="w-full h-8 px-2 text-sm bg-background text-foreground border border-border rounded outline-none focus:border-primary"
        autoFocus
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="h-8 px-2 flex items-center text-sm text-foreground cursor-pointer rounded hover:bg-muted/50"
    >
      {numValue !== null ? numValue : <span className="text-muted-foreground">-</span>}
    </div>
  )
}
