'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface AddItemRowProps {
  groupId: string
  mutations: ReturnType<typeof useBoardMutations>
  groupColor: string
}

export function AddItemRow({ groupId, mutations, groupColor }: AddItemRowProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  const submit = async () => {
    if (!name.trim()) {
      setAdding(false)
      return
    }
    await mutations.addItem.mutateAsync({ groupId, name: name.trim() })
    setName('')
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="flex items-center gap-2 px-3 py-2 w-full text-sm text-muted-foreground hover:bg-muted/30"
      >
        <div className="w-10 flex items-center justify-center">
          <Plus className="h-3 w-3" />
        </div>
        Add item
      </button>
    )
  }

  return (
    <div className="flex items-center border-b last:border-b-0">
      <div className="w-10 px-2 py-2 flex-shrink-0">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: groupColor }} />
      </div>
      <div className="flex-1 px-3 py-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') {
              setName('')
              setAdding(false)
            }
          }}
          placeholder="New item name"
          className="w-full bg-transparent text-sm outline-none"
          autoFocus
        />
      </div>
    </div>
  )
}
