'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { BoardWithDetails, Group, Item } from '@boardly/shared'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface BoardDndContextProps {
  board: BoardWithDetails
  mutations: ReturnType<typeof useBoardMutations>
  children: React.ReactNode
}

export function BoardDndContext({ board, mutations, children }: BoardDndContextProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'group' | 'item' | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const isGroupId = useCallback(
    (id: string) => board.groups.some((g) => g.id === id),
    [board.groups]
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id)
      setActiveId(id)
      setActiveType(isGroupId(id) ? 'group' : 'item')
    },
    [isGroupId]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)
      setActiveType(null)

      if (!over || active.id === over.id) return

      const activeIdStr = String(active.id)
      const overIdStr = String(over.id)

      if (isGroupId(activeIdStr) && isGroupId(overIdStr)) {
        const oldIndex = board.groups.findIndex((g) => g.id === activeIdStr)
        const newIndex = board.groups.findIndex((g) => g.id === overIdStr)
        if (oldIndex === -1 || newIndex === -1) return

        const newGroups = [...board.groups]
        const [moved] = newGroups.splice(oldIndex, 1)
        newGroups.splice(newIndex, 0, moved)

        mutations.reorderGroups.mutate(
          newGroups.map((g, i) => ({ id: g.id, order: i }))
        )
        return
      }

      // Item reorder
      const allItems = board.groups.flatMap((g) =>
        (g.items || []).map((item) => ({ ...item, groupId: g.id }))
      )

      const activeItem = allItems.find((i) => i.id === activeIdStr)
      if (!activeItem) return

      // Find target group
      let targetGroupId: string
      const overItem = allItems.find((i) => i.id === overIdStr)
      if (overItem) {
        targetGroupId = overItem.groupId
      } else if (isGroupId(overIdStr)) {
        targetGroupId = overIdStr
      } else {
        return
      }

      const targetGroup = board.groups.find((g) => g.id === targetGroupId)
      if (!targetGroup) return

      const targetItems = (targetGroup.items || []).filter((i) => i.id !== activeIdStr)

      if (overItem) {
        const overIndex = targetItems.findIndex((i) => i.id === overIdStr)
        targetItems.splice(overIndex, 0, activeItem)
      } else {
        targetItems.push(activeItem)
      }

      mutations.reorderItems.mutate(
        targetItems.map((item, i) => ({
          id: item.id,
          order: i,
          groupId: targetGroupId,
        }))
      )
    },
    [board.groups, isGroupId, mutations]
  )

  const groupIds = board.groups.map((g) => g.id)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={groupIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay>
        {activeId && activeType === 'item' && (
          <div className="bg-background border rounded-md p-2 shadow-lg text-sm opacity-80">
            {board.groups
              .flatMap((g) => g.items || [])
              .find((i) => i.id === activeId)?.name}
          </div>
        )}
        {activeId && activeType === 'group' && (
          <div className="bg-background border rounded-md p-2 shadow-lg text-sm opacity-80">
            {board.groups.find((g) => g.id === activeId)?.name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
