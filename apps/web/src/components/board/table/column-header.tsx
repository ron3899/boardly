'use client'

import type { Column } from '@boardly/shared'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface ColumnHeaderProps {
  column: Column
  onDelete: () => void
}

export function ColumnHeader({ column, onDelete }: ColumnHeaderProps) {
  return (
    <div className="w-[160px] flex-shrink-0 px-3 py-2 flex items-center justify-between group/col">
      <span className="text-xs font-medium text-muted-foreground uppercase truncate">
        {column.name}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-0.5 rounded hover:bg-accent opacity-0 group-hover/col:opacity-100">
          <MoreHorizontal className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
