'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { Header } from '@/components/header'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, CheckCircle2 } from 'lucide-react'

interface ItemWithBoard {
  id: string
  name: string
  updatedAt: string
  columnValues: Array<{
    id: string
    value: any
    column: {
      id: string
      name: string
      type: string
    }
  }>
  group: {
    id: string
    name: string
    board: {
      id: string
      name: string
    }
  }
}

function getStatusFromColumnValues(columnValues: ItemWithBoard['columnValues']) {
  const statusValue = columnValues.find((cv) => cv.column.type === 'status')
  if (!statusValue || !statusValue.value) return null
  return statusValue.value as string
}

function StatusPill({ status }: { status: string | null }) {
  if (!status) return <Badge variant="secondary">Not started</Badge>

  const variants: Record<string, { label: string; className: string }> = {
    'working-on-it': { label: 'Working on it', className: 'bg-yellow-500 hover:bg-yellow-600' },
    done: { label: 'Done', className: 'bg-green-500 hover:bg-green-600' },
    stuck: { label: 'Stuck', className: 'bg-red-500 hover:bg-red-600' },
    'not-started': { label: 'Not started', className: 'bg-gray-500 hover:bg-gray-600' },
  }

  const variant = variants[status] || variants['not-started']

  return (
    <Badge className={`${variant.className} text-white`}>
      {variant.label}
    </Badge>
  )
}

export default function MyWorkPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-items'],
    queryFn: () => api.get<{ items: ItemWithBoard[] }>('/me/items'),
  })

  const items = data?.items || []

  // Group items by board
  const itemsByBoard = items.reduce((acc, item) => {
    const boardName = item.group.board.name
    if (!acc[boardName]) {
      acc[boardName] = {
        boardId: item.group.board.id,
        items: [],
      }
    }
    acc[boardName].items.push(item)
    return acc
  }, {} as Record<string, { boardId: string; items: ItemWithBoard[] }>)

  return (
    <div className="flex flex-col h-full">
      <Header title="My Work">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4" />
          <span>{items.length} items assigned to you</span>
        </div>
      </Header>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No work assigned</h3>
            <p className="text-muted-foreground">
              Items assigned to you will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(itemsByBoard).map(([boardName, { boardId, items }]) => (
              <div key={boardId} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{boardName}</h3>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2 grid grid-cols-[1fr,200px,150px] gap-4 text-sm font-medium">
                    <div>Item</div>
                    <div>Status</div>
                    <div>Updated</div>
                  </div>

                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/app/boards/${boardId}?item=${item.id}`}
                      className="block border-t hover:bg-accent transition-colors"
                    >
                      <div className="px-4 py-3 grid grid-cols-[1fr,200px,150px] gap-4 items-center">
                        <div className="font-medium truncate">{item.name}</div>
                        <div>
                          <StatusPill status={getStatusFromColumnValues(item.columnValues)} />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
