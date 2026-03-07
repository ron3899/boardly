'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'

interface CreateBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const [name, setName] = useState('')
  const createBoard = useCreateBoard()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const { board } = await createBoard.mutateAsync({ name: name.trim() })
      toast({ title: 'Board created successfully!' })
      setName('')
      onOpenChange(false)
      router.push(`/app/boards/${board.id}`)
    } catch {
      toast({ title: 'Failed to create board', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-monday-border rounded-lg shadow-monday-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-monday-text-primary flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-monday-purple-light flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-monday-purple" />
            </div>
            Create new board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Board name input */}
          <div>
            <label className="block text-sm font-medium text-monday-text-primary mb-2">
              Board name
            </label>
            <Input
              placeholder="e.g., Marketing Campaign, Product Roadmap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="h-10 border-monday-border focus:border-monday-purple focus:ring-monday-purple"
            />
            <p className="mt-1.5 text-xs text-monday-text-secondary">
              Choose a descriptive name for your board
            </p>
          </div>

          {/* Action buttons - Monday.com style */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 border-monday-border text-monday-text-primary hover:bg-monday-purple-light"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createBoard.isPending}
              className="h-9 px-6 bg-monday-purple hover:bg-monday-purple-dark text-white font-semibold active:scale-95 transition-all disabled:opacity-50"
            >
              {createBoard.isPending ? 'Creating...' : 'Create board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
