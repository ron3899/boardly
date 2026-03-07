'use client'

import Link from 'next/link'
import type { Board } from '@boardly/shared'
import { MoreHorizontal, Trash2, Users, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface BoardCardProps {
  board: Board
  onDelete: (id: string) => void
}

// Cycle through Monday.com accent colors for boards
const accentColors = [
  'board-accent-purple',
  'board-accent-green',
  'board-accent-orange',
  'board-accent-blue',
  'board-accent-pink',
]

function getAccentColor(boardId: string): string {
  // Simple hash to consistently assign colors based on board ID
  const hash = boardId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return accentColors[hash % accentColors.length]
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  const accentClass = getAccentColor(board.id)

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-monday-sm hover:shadow-monday-md transition-all duration-150 hover:-translate-y-0.5">
      {/* Top colored accent bar - Monday.com style */}
      <div className={`h-1 w-full ${accentClass}`}></div>

      <Link href={`/app/boards/${board.id}`} className="block">
        <div className="p-5">
          {/* Board name */}
          <h3 className="text-base font-semibold text-monday-text-primary mb-2">
            {board.name}
          </h3>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-monday-text-secondary">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated {new Date(board.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Team</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Dropdown menu - appears on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-md hover:bg-monday-purple-light transition-colors">
            <MoreHorizontal className="h-4 w-4 text-monday-text-secondary" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-monday-red focus:text-monday-red focus:bg-monday-red/10"
              onClick={(e) => {
                e.preventDefault()
                onDelete(board.id)
              }}
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
