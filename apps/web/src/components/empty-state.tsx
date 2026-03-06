import { LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateBoard: () => void
}

export function EmptyState({ onCreateBoard }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <LayoutDashboard className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
      <p className="text-muted-foreground mb-6">Create your first board to get started</p>
      <Button onClick={onCreateBoard}>Create board</Button>
    </div>
  )
}
