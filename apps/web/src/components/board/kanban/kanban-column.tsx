'use client'

import type { Item, ColumnValue } from '@boardly/shared'
import { KanbanCard } from './kanban-card'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface KanbanColumnProps {
  statusKey: string | null
  label: { color: string; label: string }
  items: (Item & { groupId: string })[]
  statusColumnId: string
  mutations: ReturnType<typeof useBoardMutations>
}

export function KanbanColumn({ statusKey, label, items, statusColumnId, mutations }: KanbanColumnProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData('text/plain')
    if (itemId) {
      mutations.updateValue.mutate({
        itemId,
        columnId: statusColumnId,
        value: statusKey,
      })
    }
  }

  return (
    <div
      className="w-72 flex-shrink-0 flex flex-col"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
        style={{ backgroundColor: label.color }}
      >
        <span className="text-sm font-semibold text-white">{label.label}</span>
        <span className="text-xs text-white/80">{items.length}</span>
      </div>
      <div className="flex-1 bg-muted/30 rounded-b-lg p-2 space-y-2 min-h-[100px]">
        {items.map((item) => (
          <KanbanCard key={item.id} item={item} mutations={mutations} />
        ))}
      </div>
    </div>
  )
}
