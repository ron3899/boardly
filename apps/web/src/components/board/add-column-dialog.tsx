'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { COLUMN_TYPES, DEFAULT_STATUS_LABELS } from '@boardly/shared'
import type { useBoardMutations } from '@/hooks/use-board-mutations'
import { useToast } from '@/components/ui/toast'

interface AddColumnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mutations: ReturnType<typeof useBoardMutations>
}

export function AddColumnDialog({ open, onOpenChange, mutations }: AddColumnDialogProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState('text')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const settings: Record<string, unknown> = {}
    if (type === 'status') {
      settings.labels = DEFAULT_STATUS_LABELS
    }
    if (type === 'dropdown') {
      settings.options = ['Option 1', 'Option 2', 'Option 3']
    }

    try {
      await mutations.addColumn.mutateAsync({ name: name.trim(), type, settings })
      toast({ title: 'Column added' })
      setName('')
      setType('text')
      onOpenChange(false)
    } catch {
      toast({ title: 'Failed to add column', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Column name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Column type" />
            </SelectTrigger>
            <SelectContent>
              {COLUMN_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
