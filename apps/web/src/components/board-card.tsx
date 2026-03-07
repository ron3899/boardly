'use client'

import Link from 'next/link'
import type { Board } from '@boardly/shared'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface BoardCardProps {
  board: Board
  onDelete: (id: string) => void
}

// Monday.com accent colors for board strips
const accentColors = [
  '#6161FF', // purple
  '#00C875', // green
  '#FDAB3D', // orange
  '#E2445C', // red
  '#579BFC', // blue
  '#FF7575', // light red
  '#A25DDC', // violet
]

// Board emojis/icons based on name hash
const getBoardEmoji = (name: string) => {
  const emojis = ['📊', '🎯', '📝', '💼', '🚀', '📈', '✨', '🎨']
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % emojis.length
  return emojis[index]
}

// Get accent color based on board ID
const getAccentColor = (id: string) => {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % accentColors.length
  return accentColors[index]
}

// Get days since update
const getDaysSince = (date: Date) => {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  const accentColor = getAccentColor(board.id)
  const boardEmoji = getBoardEmoji(board.name)

  // Mock member avatars (colored circles)
  const memberColors = ['#6161FF', '#00C875', '#FDAB3D']

  return (
    <div className="group relative rounded-lg bg-white monday-card-shadow hover:monday-card-shadow-hover transition-all hover:-translate-y-1 duration-200">
      {/* Top colored strip */}
      <div
        className="h-1.5 rounded-t-lg"
        style={{ backgroundColor: accentColor }}
      />

      <Link href={`/app/boards/${board.id}`} className="block p-5">
        <div className="flex items-start gap-3 mb-3">
          {/* Board Icon/Emoji */}
          <div className="text-2xl flex-shrink-0">{boardEmoji}</div>

          {/* Board Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[15px] text-[#323338] mb-1 truncate">
              {board.name}
            </h3>
            <p className="text-xs text-[#676879]">
              Last updated {getDaysSince(board.updatedAt)}
            </p>
          </div>
        </div>

        {/* Bottom section - Members and Items */}
        <div className="flex items-center justify-between mt-4">
          {/* Member Avatars */}
          <div className="flex -space-x-2">
            {memberColors.map((color, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: color }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>

          {/* Items Count */}
          <span className="text-xs text-[#9699A6] font-medium">
            {Math.floor(Math.random() * 20) + 5} items
          </span>
        </div>
      </Link>

      {/* Three-dot menu (appears on hover) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-[#F6F7FB] transition-colors">
            <MoreHorizontal className="h-4 w-4 text-[#676879]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-monday-danger hover:text-monday-danger hover:bg-monday-danger/10 cursor-pointer"
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
