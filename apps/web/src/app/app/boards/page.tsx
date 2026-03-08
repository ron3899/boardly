'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BoardCard } from '@/components/board-card'
import { CreateBoardDialog } from '@/components/create-board-dialog'
import { useBoards, useDeleteBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { Plus, LayoutGrid } from 'lucide-react'

export default function AllBoardsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: boards, isLoading } = useBoards()
  const deleteBoard = useDeleteBoard()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board?')) return
    try {
      await deleteBoard.mutateAsync(id)
      toast({ title: 'Board deleted successfully' })
    } catch {
      toast({ title: 'Failed to delete board', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="All Boards" breadcrumb="Work Management">
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="bg-monday-purple hover:bg-monday-purple-hover text-white font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Board
        </Button>
      </Header>

      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="h-8 w-8 text-monday-purple" />
            <h1 className="text-3xl font-semibold text-[#323338] dark:text-[#F0F0F5]">
              All Boards
            </h1>
          </div>
          <p className="text-[#676879] dark:text-[#9090A8] text-base">
            {boards?.length || 0} {boards?.length === 1 ? 'board' : 'boards'} in your workspace
          </p>
        </div>

        {/* Boards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : !boards || boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-monday-purple/10 flex items-center justify-center mb-4">
              <LayoutGrid className="h-10 w-10 text-monday-purple" />
            </div>
            <h3 className="text-xl font-semibold text-[#323338] mb-2">
              No boards yet
            </h3>
            <p className="text-[#676879] text-center max-w-md mb-6">
              Create your first board to start organizing your work
            </p>
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-monday-purple hover:bg-monday-purple-hover text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} onDelete={handleDelete} />
            ))}

            {/* Add New Board Card */}
            <button
              onClick={() => setCreateOpen(true)}
              className="group relative rounded-lg border-2 border-dashed border-[#E6E9EF] bg-white hover:border-monday-purple hover:bg-monday-purple/5 transition-all p-8 flex flex-col items-center justify-center min-h-[140px]"
            >
              <div className="w-12 h-12 rounded-full bg-monday-purple/10 group-hover:bg-monday-purple/20 flex items-center justify-center mb-3 transition-colors">
                <Plus className="h-6 w-6 text-monday-purple" />
              </div>
              <span className="text-sm font-medium text-[#676879] group-hover:text-monday-purple transition-colors">
                New Board
              </span>
            </button>
          </div>
        )}
      </div>

      <CreateBoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
