'use client'

import Link from 'next/link'
import type { Board } from '@boardly/shared'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface BoardCardProps {
  board: Board
  onDelete: (id: string) => void
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  // Monday.com color palette for board cards
  const colors = ['#6C6CFF', '#FF7B54', '#00B4D8', '#00C875', '#FF69B4', '#FDAB3D']
  const accentColor = colors[Math.abs(board.name.charCodeAt(0)) % colors.length]

  return (
    <div className="group relative rounded-lg bg-white p-5 shadow-monday-card hover:shadow-monday-hover hover:-translate-y-1 monday-transition border border-gray-100 overflow-hidden">
      {/* Monday.com style accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: accentColor }}
      />

      <Link href={`/app/boards/${board.id}`} className="block pl-2">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-sm shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {board.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-monday-purple monday-transition">
            {board.name}
          </h3>
        </div>
        <p className="text-xs text-gray-500 pl-2">
          Updated {new Date(board.updatedAt).toLocaleDateString()}
        </p>
      </Link>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 monday-transition">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-gray-100 monday-transition">
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-monday-red hover:bg-monday-red-light"
              onClick={() => onDelete(board.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
