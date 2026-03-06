'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import type { BoardWithDetails } from '@boardly/shared'
import { BoardHeader } from './board-header'
import { TableView } from './table/table-view'
import { KanbanView } from './kanban/kanban-view'
import { ViewToggle } from './view-toggle'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface BoardViewProps {
  board: BoardWithDetails
  mutations: ReturnType<typeof useBoardMutations>
}

export function BoardView({ board, mutations }: BoardViewProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const view = searchParams.get('view') || 'table'

  const setView = (v: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', v)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col h-full">
      <BoardHeader board={board} mutations={mutations}>
        <ViewToggle view={view} onViewChange={setView} />
      </BoardHeader>
      {view === 'kanban' ? (
        <KanbanView board={board} mutations={mutations} />
      ) : (
        <TableView board={board} mutations={mutations} />
      )}
    </div>
  )
}
