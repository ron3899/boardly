'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Item, Column, ColumnValue, BoardMember, User } from '@boardly/shared'
import { GripVertical, Trash2 } from 'lucide-react'
import { Cell } from './cell'
import type { useBoardMutations } from '@/hooks/use-board-mutations'
import { useToast } from '@/components/ui/toast'

interface ItemRowProps {
  item: Item
  columns: Column[]
  mutations: ReturnType<typeof useBoardMutations>
  members: (BoardMember & { user: Pick<User, 'id' | 'name' | 'email'> })[]
  groupColor: string
}

export function ItemRow({ item, columns, mutations, members, groupColor }: ItemRowProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const save = () => {
    setEditing(false)
    if (name.trim() && name !== item.name) {
      mutations.updateItem.mutate({ id: item.id, name: name.trim() })
    } else {
      setName(item.name)
    }
  }

  const openDetail = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('item', item.id)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleDelete = () => {
    if (!confirm('Delete this item?')) return
    mutations.deleteItem.mutate(item.id)
    toast({ title: 'Item deleted' })
  }

  const getValue = (columnId: string) => {
    return item.columnValues?.find((cv: ColumnValue) => cv.columnId === columnId)?.value
  }

  const handleValueChange = useCallback((columnId: string, value: unknown) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      mutations.updateValue.mutate({ itemId: item.id, columnId, value })
    }, 300)
  }, [item.id, mutations])

  return (
    <div className="flex items-center border-b last:border-b-0 hover:bg-muted/30 group/row">
      <div className="w-10 px-2 py-2 flex-shrink-0 flex items-center justify-center">
        <div className="w-1 h-8 rounded-full mr-1" style={{ backgroundColor: groupColor }} />
        <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover/row:opacity-100 cursor-grab" />
      </div>
      <div className="min-w-[250px] flex-1 px-3 py-2 flex items-center gap-2">
        {editing ? (
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setName(item.name)
                setEditing(false)
              }
            }}
            className="flex-1 bg-transparent border-b border-primary outline-none text-sm"
            autoFocus
          />
        ) : (
          <span
            className="flex-1 text-sm cursor-pointer hover:text-primary truncate"
            onClick={openDetail}
            onDoubleClick={() => setEditing(true)}
          >
            {item.name}
          </span>
        )}
        <button
          onClick={handleDelete}
          className="p-1 rounded hover:bg-accent text-muted-foreground opacity-0 group-hover/row:opacity-100"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {columns.map((col) => (
        <Cell
          key={col.id}
          column={col}
          value={getValue(col.id)}
          onChange={(value) => handleValueChange(col.id, value)}
          members={members}
        />
      ))}
      <div className="w-10 flex-shrink-0" />
    </div>
  )
}
