'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'

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
      toast({ title: 'Board created' })
      setName('')
      onOpenChange(false)
      router.push(`/app/boards/${board.id}`)
    } catch {
      toast({ title: 'Failed to create board', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Board name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createBoard.isPending}
              className="bg-[#6161FF] hover:bg-[#5151EF]"
            >
              {createBoard.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
