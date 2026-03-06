'use client'

import { useState } from 'react'

interface TextCellProps {
  value: unknown
  onChange: (value: unknown) => void
}

export function TextCell({ value, onChange }: TextCellProps) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState((value as string) || '')

  const save = () => {
    setEditing(false)
    if (text !== (value || '')) {
      onChange(text)
    }
  }

  if (editing) {
    return (
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') {
            setText((value as string) || '')
            setEditing(false)
          }
        }}
        className="w-full h-8 px-2 text-sm bg-background border rounded outline-none"
        autoFocus
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="h-8 px-2 flex items-center text-sm cursor-pointer rounded hover:bg-accent truncate"
    >
      {(value as string) || <span className="text-muted-foreground">-</span>}
    </div>
  )
}
