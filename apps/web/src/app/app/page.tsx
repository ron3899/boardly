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
import { useAuth } from '@/hooks/use-auth'

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: boards, isLoading } = useBoards()
  const deleteBoard = useDeleteBoard()
  const { toast } = useToast()
  const { user } = useAuth()

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
      <Header title="Home">
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
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#323338] mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-[#676879] text-base">
            Here's what's happening with your work today
          </p>
        </div>

        {/* Boards Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : boards?.length === 0 ? (
          <EmptyState onCreateBoard={() => setCreateOpen(true)} />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-[#323338] mb-4">
              Your boards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {boards?.map((board) => (
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
          </>
        )}
      </div>

      <CreateBoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
