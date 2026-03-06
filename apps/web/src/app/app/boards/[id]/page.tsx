'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useBoard } from '@/hooks/use-board'
import { useBoardMutations } from '@/hooks/use-board-mutations'
import { BoardView } from '@/components/board/board-view'
import { ItemModal } from '@/components/board/item-modal'
import { Skeleton } from '@/components/ui/skeleton'

export default function BoardPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const boardId = params.id as string
  const { data: board, isLoading, error } = useBoard(boardId)
  const mutations = useBoardMutations(boardId)
  const selectedItemId = searchParams.get('item')

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !board) {
    return (
      <div className="p-6">
        <p className="text-destructive">Failed to load board</p>
      </div>
    )
  }

  const selectedItem = selectedItemId
    ? board.groups.flatMap((g) => g.items || []).find((i) => i.id === selectedItemId)
    : null

  return (
    <>
      <BoardView board={board} mutations={mutations} />
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          columns={board.columns}
          mutations={mutations}
          members={board.members}
        />
      )}
    </>
  )
}
