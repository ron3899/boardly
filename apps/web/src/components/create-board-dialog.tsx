'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

interface CreateBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Monday.com color palette for board selection
const boardColors = [
  { name: 'Purple', value: '#6161FF' },
  { name: 'Green', value: '#00C875' },
  { name: 'Orange', value: '#FDAB3D' },
  { name: 'Red', value: '#E2445C' },
  { name: 'Blue', value: '#579BFC' },
  { name: 'Pink', value: '#FF7575' },
  { name: 'Violet', value: '#A25DDC' },
]

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(boardColors[0].value)
  const createBoard = useCreateBoard()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const { board } = await createBoard.mutateAsync({ name: name.trim() })
      toast({ title: 'Board created successfully' })
      setName('')
      setSelectedColor(boardColors[0].value)
      onOpenChange(false)
      router.push(`/app/boards/${board.id}`)
    } catch {
      toast({ title: 'Failed to create board', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl border-0 shadow-xl p-0">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold text-[#323338]">
              Create new board
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Board Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#323338]">
                Board name
              </label>
              <Input
                placeholder="e.g., Marketing Campaign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="h-10 border-[#E6E9EF] focus:border-monday-purple focus:ring-monday-purple/20"
              />
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#323338]">
                Choose a color
              </label>
              <div className="flex gap-2 flex-wrap">
                {boardColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className="relative w-10 h-10 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-[#676879] hover:bg-[#F6F7FB]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || createBoard.isPending}
                className="bg-monday-purple hover:bg-monday-purple-hover text-white font-medium"
              >
                {createBoard.isPending ? 'Creating...' : 'Create Board'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
