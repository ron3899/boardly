'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Skeleton } from '@/components/ui/skeleton'
import { BoardCard } from '@/components/board-card'
import { useBoards, useDeleteBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { Star } from 'lucide-react'

export default function FavoritesPage() {
  const { data: boards, isLoading } = useBoards()
  const deleteBoard = useDeleteBoard()
  const { toast } = useToast()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('boardly-favorites')
    if (stored) {
      try {
        setFavoriteIds(JSON.parse(stored))
      } catch {
        setFavoriteIds([])
      }
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board?')) return
    try {
      await deleteBoard.mutateAsync(id)
      // Remove from favorites if deleted
      const newFavorites = favoriteIds.filter((fid) => fid !== id)
      setFavoriteIds(newFavorites)
      localStorage.setItem('boardly-favorites', JSON.stringify(newFavorites))
      toast({ title: 'Board deleted successfully' })
    } catch {
      toast({ title: 'Failed to delete board', variant: 'destructive' })
    }
  }

  const favoriteBoards = boards?.filter((board) => favoriteIds.includes(board.id)) || []

  return (
    <div className="min-h-screen">
      <Header title="Favorites" breadcrumb="Work Management" />

      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-8 w-8 text-monday-warning fill-monday-warning" />
            <h1 className="text-3xl font-semibold text-[#323338]">
              Favorites
            </h1>
          </div>
          <p className="text-[#676879] text-base">
            Quick access to your most important boards
          </p>
        </div>

        {/* Favorites Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : favoriteBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-monday-warning/10 flex items-center justify-center mb-4">
              <Star className="h-10 w-10 text-monday-warning" />
            </div>
            <h3 className="text-xl font-semibold text-[#323338] mb-2">
              No favorite boards yet
            </h3>
            <p className="text-[#676879] text-center max-w-md">
              Click the star icon on any board card to add it to your favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favoriteBoards.map((board) => (
              <BoardCard key={board.id} board={board} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
