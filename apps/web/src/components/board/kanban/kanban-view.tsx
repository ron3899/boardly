'use client'

import type { BoardWithDetails, Column, Item, Group } from '@boardly/shared'
import { KanbanColumn } from './kanban-column'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface KanbanViewProps {
  board: BoardWithDetails
  mutations: ReturnType<typeof useBoardMutations>
}

export function KanbanView({ board, mutations }: KanbanViewProps) {
  const statusColumn = board.columns.find((c) => c.type === 'status')

  if (!statusColumn) {
    return (
      <div className="p-6 text-muted-foreground">
        Add a Status column to use Kanban view.
      </div>
    )
  }

  const labels = (statusColumn.settings?.labels || {}) as Record<
    string,
    { color: string; label: string }
  >

  const allItems = board.groups.flatMap((g) =>
    (g.items || []).map((item) => ({ ...item, groupId: g.id }))
  )

  const getItemsForStatus = (statusKey: string | null) => {
    return allItems.filter((item) => {
      const val = item.columnValues?.find((cv) => cv.columnId === statusColumn.id)?.value
      if (statusKey === null) return !val || val === 'null'
      return val === statusKey
    })
  }

  const unassigned = getItemsForStatus(null)

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="flex gap-4 min-h-[400px]">
        {Object.entries(labels).map(([key, label]) => (
          <KanbanColumn
            key={key}
            statusKey={key}
            label={label}
            items={getItemsForStatus(key)}
            statusColumnId={statusColumn.id}
            mutations={mutations}
          />
        ))}
        {unassigned.length > 0 && (
          <KanbanColumn
            statusKey={null}
            label={{ color: '#c4c4c4', label: 'No Status' }}
            items={unassigned}
            statusColumnId={statusColumn.id}
            mutations={mutations}
          />
        )}
      </div>
    </div>
  )
}
