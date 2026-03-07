'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { BoardCard } from '@/components/board-card'
import { useBoards, useDeleteBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const { data: boards } = useBoards()
  const deleteBoard = useDeleteBoard()
  const { toast } = useToast()

  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board?')) return
    try {
      await deleteBoard.mutateAsync(id)
      toast({ title: 'Board deleted successfully' })
    } catch {
      toast({ title: 'Failed to delete board', variant: 'destructive' })
    }
  }

  // Filter boards by search query
  const filteredBoards = boards?.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const hasSearched = searchQuery.trim().length > 0

  return (
    <div className="min-h-screen">
      <Header title="Search" breadcrumb="Find boards and items" />

      <div className="p-6 lg:p-8">
        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#676879]" />
            <Input
              type="text"
              placeholder="Search for boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-12 text-base rounded-xl border-2 border-[#E6E9EF] focus:border-monday-purple focus:ring-monday-purple/20"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[#F6F7FB] transition-colors"
              >
                <X className="h-5 w-5 text-[#676879]" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-monday-purple/10 flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-monday-purple" />
            </div>
            <h3 className="text-xl font-semibold text-[#323338] mb-2">
              Start searching
            </h3>
            <p className="text-[#676879] text-center max-w-md">
              Type in the search box above to find boards by name
            </p>
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#E6E9EF] flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-[#9699A6]" />
            </div>
            <h3 className="text-xl font-semibold text-[#323338] mb-2">
              No results found
            </h3>
            <p className="text-[#676879] text-center max-w-md">
              We couldn't find any boards matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#323338]">
                {filteredBoards.length} {filteredBoards.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredBoards.map((board) => (
                <BoardCard key={board.id} board={board} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
