'use client'

import { Header } from '@/components/header'
import { Skeleton } from '@/components/ui/skeleton'
import { useBoards } from '@/hooks/use-boards'
import { useBoard } from '@/hooks/use-board'
import Link from 'next/link'
import { CheckSquare } from 'lucide-react'

export default function MyWorkPage() {
  const { data: boards, isLoading: boardsLoading } = useBoards()

  return (
    <div className="min-h-screen">
      <Header title="My Work" breadcrumb="Work Management" />

      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="h-8 w-8 text-monday-purple" />
            <h1 className="text-3xl font-semibold text-[#323338]">
              My Work
            </h1>
          </div>
          <p className="text-[#676879] text-base">
            All items across your boards in one place
          </p>
        </div>

        {/* Items by Board */}
        {boardsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : !boards || boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-monday-purple/10 flex items-center justify-center mb-4">
              <CheckSquare className="h-10 w-10 text-monday-purple" />
            </div>
            <h3 className="text-xl font-semibold text-[#323338] mb-2">
              No work items yet
            </h3>
            <p className="text-[#676879] text-center max-w-md">
              Create a board and add items to see your work here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {boards.map((board) => (
              <BoardItemsSection key={board.id} boardId={board.id} boardName={board.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BoardItemsSection({ boardId, boardName }: { boardId: string; boardName: string }) {
  const { data: boardDetails, isLoading } = useBoard(boardId)

  if (isLoading) {
    return <Skeleton className="h-32 rounded-lg" />
  }

  if (!boardDetails) return null

  // Collect all items from all groups
  const allItems = boardDetails.groups.flatMap((group) =>
    (group.items || []).map((item) => ({
      ...item,
      groupName: group.name,
      groupColor: group.color,
      boardName,
      boardId,
    }))
  )

  if (allItems.length === 0) return null

  return (
    <div className="bg-white rounded-lg monday-card-shadow overflow-hidden">
      {/* Board Header */}
      <div className="px-6 py-4 border-b border-[#E6E9EF]">
        <Link
          href={`/app/boards/${boardId}`}
          className="text-lg font-semibold text-[#323338] hover:text-monday-purple transition-colors"
        >
          {boardName}
        </Link>
        <p className="text-sm text-[#676879] mt-1">
          {allItems.length} {allItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F6F7FB] border-b border-[#E6E9EF]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#676879] uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#676879] uppercase tracking-wider">
                Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#676879] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E9EF]">
            {allItems.map((item) => {
              // Find status column value
              const statusColumn = boardDetails.columns.find((col) => col.type === 'status')
              const statusValue = statusColumn
                ? item.columnValues?.find((cv) => cv.columnId === statusColumn.id)
                : null

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#F6F7FB] transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/app/boards/${boardId}`}
                      className="text-sm font-medium text-[#323338] hover:text-monday-purple transition-colors"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: item.groupColor }}
                    >
                      {item.groupName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {statusValue ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#00C875] text-white">
                        {(statusValue.value as any)?.label || 'No status'}
                      </span>
                    ) : (
                      <span className="text-sm text-[#9699A6]">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
