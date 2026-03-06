'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BoardCard } from '@/components/board-card'
import { CreateBoardDialog } from '@/components/create-board-dialog'
import { EmptyState } from '@/components/empty-state'
import { useBoards, useDeleteBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: boards, isLoading } = useBoards()
  const deleteBoard = useDeleteBoard()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board?')) return
    try {
      await deleteBoard.mutateAsync(id)
      toast({ title: 'Board deleted' })
    } catch {
      toast({ title: 'Failed to delete board', variant: 'destructive' })
    }
  }

  return (
    <div>
      <Header title="Dashboard">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Board
        </Button>
      </Header>

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : boards?.length === 0 ? (
          <EmptyState onCreateBoard={() => setCreateOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards?.map((board) => (
              <BoardCard key={board.id} board={board} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <CreateBoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
