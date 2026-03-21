'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { Check, Plus, X } from 'lucide-react'

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

// Group colors for visual distinction
const groupColors = ['#579BFC', '#00C875', '#FDAB3D', '#E2445C', '#A25DDC', '#FF7575']

interface GroupInput {
  id: string
  name: string
  color: string
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(boardColors[0].value)
  const [groups, setGroups] = useState<GroupInput[]>([
    { id: '1', name: 'Group 1', color: groupColors[0] },
    { id: '2', name: 'Group 2', color: groupColors[1] },
  ])
  const createBoard = useCreateBoard()
  const { toast } = useToast()
  const router = useRouter()

  const handleAddGroup = () => {
    if (groups.length >= 10) return
    const nextId = (Math.max(...groups.map((g) => parseInt(g.id)), 0) + 1).toString()
    const colorIndex = groups.length % groupColors.length
    setGroups([
      ...groups,
      { id: nextId, name: `Group ${groups.length + 1}`, color: groupColors[colorIndex] },
    ])
  }

  const handleRemoveGroup = (id: string) => {
    if (groups.length <= 1) return // Keep at least 1 group
    setGroups(groups.filter((g) => g.id !== id))
  }

  const handleUpdateGroupName = (id: string, name: string) => {
    setGroups(groups.map((g) => (g.id === id ? { ...g, name } : g)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const { board } = await createBoard.mutateAsync({
        name: name.trim(),
        groups: groups.map((g) => ({ name: g.name, color: g.color })),
      })
      toast({ title: 'Board created successfully' })
      setName('')
      setSelectedColor(boardColors[0].value)
      setGroups([
        { id: '1', name: 'Group 1', color: groupColors[0] },
        { id: '2', name: 'Group 2', color: groupColors[1] },
      ])
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

            {/* Divider */}
            <div className="border-t border-[#E6E9EF]" />

            {/* Groups Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#323338]">
                Groups
              </label>
              <div className="space-y-2">
                {groups.map((group, index) => (
                  <div key={group.id} className="flex items-center gap-2">
                    {/* Color indicator */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                    {/* Group name input */}
                    <Input
                      value={group.name}
                      onChange={(e) => handleUpdateGroupName(group.id, e.target.value)}
                      className="h-9 flex-1 border-[#E6E9EF] focus:border-monday-purple focus:ring-monday-purple/20"
                      placeholder={`Group ${index + 1}`}
                    />
                    {/* Delete button (only show if more than 1 group) */}
                    {groups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(group.id)}
                        className="p-1.5 text-[#676879] hover:text-[#E2445C] hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="Remove group"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {/* Add Group button */}
              {groups.length < 10 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddGroup}
                  className="w-full h-9 text-monday-purple hover:bg-[#F6F7FB] hover:text-monday-purple-hover border border-dashed border-[#E6E9EF]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              )}
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
