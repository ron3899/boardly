'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { Header } from '@/components/header'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Search, FileText, Folder } from 'lucide-react'

interface Board {
  id: string
  name: string
  updatedAt: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: boardsData, isLoading: isLoadingBoards } = useQuery({
    queryKey: ['boards'],
    queryFn: () => api.get<{ boards: Board[] }>('/boards'),
  })

  const { data: itemsData, isLoading: isLoadingItems } = useQuery({
    queryKey: ['my-items'],
    queryFn: () => api.get<{ items: any[] }>('/me/items'),
    enabled: false, // Only enable when we have a proper search endpoint
  })

  const boards = boardsData?.boards || []
  const items = itemsData?.items || []

  // Filter results based on search query
  const filteredBoards = debouncedQuery
    ? boards.filter((board) =>
        board.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : []

  const filteredItems = debouncedQuery
    ? items.filter((item) =>
        item.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : []

  const hasResults = filteredBoards.length > 0 || filteredItems.length > 0
  const isLoading = isLoadingBoards || isLoadingItems
  const showResults = debouncedQuery.length > 0

  return (
    <div className="flex flex-col h-full">
      <Header title="Search">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </Header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search boards and items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoFocus
            />
          </div>

          {!showResults ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 p-4 rounded-full bg-muted">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Boardly</h3>
              <p className="text-muted-foreground">
                Start typing to search for boards and items
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 p-4 rounded-full bg-muted">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBoards.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Boards</h3>
                    <Badge variant="secondary">{filteredBoards.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {filteredBoards.map((board) => (
                      <Link
                        key={board.id}
                        href={`/app/boards/${board.id}`}
                        className="block border rounded-lg p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                            <Folder className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{board.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Updated {new Date(board.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Items</h3>
                    <Badge variant="secondary">{filteredItems.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {filteredItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/app/boards/${item.group.board.id}?item=${item.id}`}
                        className="block border rounded-lg p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-secondary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              in {item.group.board.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
