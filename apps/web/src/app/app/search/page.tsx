'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { BoardCard } from '@/components/board-card'
import { useBoards, useDeleteBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { Search, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'

type CategoryType = 'all' | 'boards' | 'tasks'

const RECENT_SEARCHES = ['Marketing', 'Q1 Planning', 'Design System', 'Product Roadmap']

const CATEGORIES = [
  { id: 'all' as CategoryType, label: 'All', icon: Sparkles },
  { id: 'boards' as CategoryType, label: 'Boards', icon: Search },
  { id: 'tasks' as CategoryType, label: 'Tasks', icon: Search },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [category, setCategory] = useState<CategoryType>('all')
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
  const filteredBoards = useMemo(() => {
    if (!boards) return []

    const query = searchQuery.toLowerCase().trim()
    if (!query) return []

    return boards.filter((board) =>
      board.name.toLowerCase().includes(query)
    )
  }, [boards, searchQuery])

  const hasSearched = searchQuery.trim().length > 0
  const showTasksEmpty = category === 'tasks' && hasSearched
  const showBoardResults = (category === 'all' || category === 'boards') && hasSearched

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] dark:bg-[#111116]">
      <Header title="Search" breadcrumb="Find boards and items" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Search Input */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#676879] dark:text-[#9090A8]" />
            <Input
              type="text"
              placeholder="Search boards, tasks, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-16 pl-16 pr-16 text-lg rounded-2xl border-2 border-[#E6E9EF] dark:border-[#2A2A38] bg-white dark:bg-[#17171F] focus:border-monday-purple focus:ring-monday-purple/20 shadow-sm"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-[#F6F7FB] dark:hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-[#676879] dark:text-[#9090A8]" />
              </button>
            )}
          </div>

          {/* Recent Searches */}
          {!hasSearched && (
            <div className="mt-6">
              <p className="text-sm font-medium text-[#676879] dark:text-[#9090A8] mb-3">
                Recent searches
              </p>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleRecentSearchClick(search)}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-[#17171F] border border-[#E6E9EF] dark:border-[#2A2A38] text-sm font-medium text-[#323338] dark:text-[#F0F0F5] hover:border-monday-purple hover:text-monday-purple hover:shadow-sm transition-all"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        {hasSearched && (
          <div className="flex items-center gap-3 mb-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = category === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-monday-purple text-white shadow-md shadow-monday-purple/30'
                      : 'bg-white dark:bg-[#17171F] text-[#676879] dark:text-[#9090A8] border border-[#E6E9EF] dark:border-[#2A2A38] hover:border-monday-purple hover:text-monday-purple'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Results */}
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 mt-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-monday-purple/20 to-monday-info/20 flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-monday-purple" />
            </div>
            <h3 className="text-2xl font-semibold text-[#323338] dark:text-[#F0F0F5] mb-3">
              Start searching
            </h3>
            <p className="text-[#676879] dark:text-[#9090A8] text-center max-w-md text-base">
              Type in the search box above to find boards, tasks, and more. Try clicking on a recent search to get started.
            </p>
          </div>
        ) : showTasksEmpty ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-[#E6E9EF] dark:bg-[#2A2A38] flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-[#9699A6] dark:text-[#5A5A70]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#323338] dark:text-[#F0F0F5] mb-3">
              Tasks search coming soon
            </h3>
            <p className="text-[#676879] dark:text-[#9090A8] text-center max-w-md text-base">
              We're working on bringing task search to Boardly. For now, try searching for boards!
            </p>
          </div>
        ) : showBoardResults && filteredBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-[#E6E9EF] dark:bg-[#2A2A38] flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-[#9699A6] dark:text-[#5A5A70]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#323338] dark:text-[#F0F0F5] mb-3">
              No results found
            </h3>
            <p className="text-[#676879] dark:text-[#9090A8] text-center max-w-md text-base">
              We couldn't find any boards matching "<span className="font-semibold text-[#323338] dark:text-[#F0F0F5]">{searchQuery}</span>". Try searching for something else.
            </p>
          </div>
        ) : showBoardResults && filteredBoards.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#323338] dark:text-[#F0F0F5]">
                {filteredBoards.length} {filteredBoards.length === 1 ? 'board' : 'boards'} found
              </h2>
              <p className="text-sm text-[#676879] dark:text-[#9090A8] mt-1">
                Showing results for "<span className="font-medium">{searchQuery}</span>"
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredBoards.map((board) => (
                <BoardCard key={board.id} board={board} onDelete={handleDelete} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
