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
  return (
    <div className="group relative rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/app/boards/${board.id}`} className="block">
        <h3 className="font-semibold text-lg mb-1">{board.name}</h3>
        <p className="text-sm text-muted-foreground">
          Updated {new Date(board.updatedAt).toLocaleDateString()}
        </p>
      </Link>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded hover:bg-accent">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(board.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
