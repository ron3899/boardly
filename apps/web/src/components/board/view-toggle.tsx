'use client'

import { Table, Columns3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: string
  onViewChange: (view: string) => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-md border">
      <Button
        variant="ghost"
        size="sm"
        className={cn('rounded-r-none', view === 'table' && 'bg-accent')}
        onClick={() => onViewChange('table')}
      >
        <Table className="h-4 w-4 mr-1" />
        Table
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn('rounded-l-none', view === 'kanban' && 'bg-accent')}
        onClick={() => onViewChange('kanban')}
      >
        <Columns3 className="h-4 w-4 mr-1" />
        Kanban
      </Button>
    </div>
  )
}
