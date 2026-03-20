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
        className="w-full h-8 px-2 text-sm bg-background text-foreground border border-border rounded outline-none focus:border-primary"
        autoFocus
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="h-8 px-2 flex items-center text-sm text-foreground cursor-pointer rounded hover:bg-muted/50 truncate"
    >
      {(value as string) || <span className="text-muted-foreground">-</span>}
    </div>
  )
}
