'use client'

import type { Item, ColumnValue } from '@boardly/shared'
import { KanbanCard } from './kanban-card'
import type { useBoardMutations } from '@/hooks/use-board-mutations'
import { Plus } from 'lucide-react'

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
      className="w-80 flex-shrink-0 flex flex-col monday-transition"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Monday.com style column header with gradient */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-lg shadow-sm"
        style={{
          backgroundColor: label.color,
          backgroundImage: `linear-gradient(135deg, ${label.color} 0%, ${label.color}dd 100%)`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white drop-shadow-sm">{label.label}</span>
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-white">
            {items.length}
          </span>
        </div>
        <button className="p-1 rounded hover:bg-white/20 monday-transition">
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Monday.com style card container */}
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100/50 rounded-b-lg p-3 space-y-2.5 min-h-[200px] border-l border-r border-b border-gray-200">
        {items.map((item) => (
          <KanbanCard key={item.id} item={item} mutations={mutations} />
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <p className="text-sm">No items yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
