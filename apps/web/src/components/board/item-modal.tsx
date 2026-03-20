'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Item, Column, ColumnValue, BoardMember, User } from '@boardly/shared'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ItemModalField } from './item-modal-field'
import type { useBoardMutations } from '@/hooks/use-board-mutations'
import { useState, useRef } from 'react'

interface ItemModalProps {
  item: Item
  columns: Column[]
  mutations: ReturnType<typeof useBoardMutations>
  members: (BoardMember & { user: Pick<User, 'id' | 'name' | 'email'> })[]
}

export function ItemModal({ item, columns, mutations, members }: ItemModalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState(item.name)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const close = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('item')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const saveName = () => {
    if (name.trim() && name !== item.name) {
      mutations.updateItem.mutate({ id: item.id, name: name.trim() })
    }
  }

  const getValue = (columnId: string) => {
    return item.columnValues?.find((cv: ColumnValue) => cv.columnId === columnId)?.value
  }

  const handleValueChange = (columnId: string, value: unknown) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      mutations.updateValue.mutate({ itemId: item.id, columnId, value })
    }, 300)
  }

  return (
    <Sheet open={true} onOpenChange={close}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName()
              }}
              className="w-full bg-background text-foreground text-lg font-semibold outline-none border-b border-transparent focus:border-primary"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {columns.map((col) => (
            <ItemModalField
              key={col.id}
              column={col}
              value={getValue(col.id)}
              onChange={(value) => handleValueChange(col.id, value)}
              members={members}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
