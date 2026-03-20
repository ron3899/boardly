'use client'

import { useState, useRef, useEffect } from 'react'
import type { BoardWithDetails } from '@boardly/shared'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface BoardHeaderProps {
  board: BoardWithDetails
  mutations: ReturnType<typeof useBoardMutations>
  children?: React.ReactNode
}

export function BoardHeader({ board, mutations, children }: BoardHeaderProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(board.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(board.name)
  }, [board.name])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = () => {
    setEditing(false)
    if (name.trim() && name !== board.name) {
      mutations.updateBoardName.mutate(name.trim())
    } else {
      setName(board.name)
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-background">
      <div>
        {editing ? (
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setName(board.name)
                setEditing(false)
              }
            }}
            className="text-lg font-semibold bg-background text-foreground border-b-2 border-primary outline-none"
          />
        ) : (
          <h2
            className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary"
            onClick={() => setEditing(true)}
          >
            {board.name}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  )
}
