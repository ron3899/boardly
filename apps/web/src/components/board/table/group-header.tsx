'use client'

import { useState, useRef, useEffect } from 'react'
import type { Group } from '@boardly/shared'
import { ChevronDown, ChevronRight, Trash2, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import type { useBoardMutations } from '@/hooks/use-board-mutations'
import { useToast } from '@/components/ui/toast'

const GROUP_COLORS = ['#579bfc', '#fdab3d', '#00c875', '#e2445c', '#a25ddc', '#037f4c', '#66ccff', '#ff642e']

interface GroupHeaderProps {
  group: Group
  mutations: ReturnType<typeof useBoardMutations>
}

export function GroupHeader({ group, mutations }: GroupHeaderProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(group.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = () => {
    setEditing(false)
    if (name.trim() && name !== group.name) {
      mutations.updateGroup.mutate({ id: group.id, name: name.trim() })
    } else {
      setName(group.name)
    }
  }

  const handleDelete = () => {
    if (!confirm('Delete this group and all its items?')) return
    mutations.deleteGroup.mutate(group.id)
    toast({ title: 'Group deleted' })
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        onClick={() => mutations.updateGroup.mutate({ id: group.id, collapsed: !group.collapsed })}
        className="p-0.5"
      >
        {group.collapsed ? (
          <ChevronRight className="h-4 w-4" style={{ color: group.color }} />
        ) : (
          <ChevronDown className="h-4 w-4" style={{ color: group.color }} />
        )}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') {
              setName(group.name)
              setEditing(false)
            }
          }}
          className="text-base font-semibold bg-background text-foreground border-b-2 outline-none"
          style={{ borderColor: group.color }}
        />
      ) : (
        <h3
          className="text-base font-semibold cursor-pointer"
          style={{ color: group.color }}
          onClick={() => setEditing(true)}
        >
          {group.name}
        </h3>
      )}

      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        {group.items?.length || 0} items
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-colors">
          <Palette className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-popover border-border">
          <div className="flex gap-1 p-2">
            {GROUP_COLORS.map((color) => (
              <button
                key={color}
                className={cn(
                  'w-6 h-6 rounded-full border-2',
                  group.color === color ? 'border-foreground' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                onClick={() => mutations.updateGroup.mutate({ id: group.id, color })}
              />
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
