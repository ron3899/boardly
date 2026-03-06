'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { useBoardMutations } from '@/hooks/use-board-mutations'
import { useToast } from '@/components/ui/toast'

interface AddGroupButtonProps {
  mutations: ReturnType<typeof useBoardMutations>
}

export function AddGroupButton({ mutations }: AddGroupButtonProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const { toast } = useToast()

  const submit = async () => {
    if (!name.trim()) {
      setAdding(false)
      return
    }
    try {
      await mutations.addGroup.mutateAsync(name.trim())
      toast({ title: 'Group added' })
      setName('')
      setAdding(false)
    } catch {
      toast({ title: 'Failed to add group', variant: 'destructive' })
    }
  }

  if (!adding) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setAdding(true)} className="text-muted-foreground">
        <Plus className="h-4 w-4 mr-2" />
        Add new group
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') {
            setName('')
            setAdding(false)
          }
        }}
        placeholder="Group name"
        className="w-48"
        autoFocus
      />
      <Button size="sm" onClick={submit}>Add</Button>
      <Button size="sm" variant="ghost" onClick={() => { setName(''); setAdding(false) }}>Cancel</Button>
    </div>
  )
}
