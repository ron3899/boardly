'use client'

import { useState } from 'react'
import type { BoardWithDetails } from '@boardly/shared'
import { GroupHeader } from './group-header'
import { ColumnHeader } from './column-header'
import { ItemRow } from './item-row'
import { AddItemRow } from './add-item-row'
import { AddGroupButton } from './add-group-button'
import { AddColumnDialog } from '../add-column-dialog'
import { BoardDndContext } from '../dnd/board-dnd-context'
import { SortableGroup } from '../dnd/sortable-group'
import { SortableItem } from '../dnd/sortable-item'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface TableViewProps {
  board: BoardWithDetails
  mutations: ReturnType<typeof useBoardMutations>
}

export function TableView({ board, mutations }: TableViewProps) {
  const [addColumnOpen, setAddColumnOpen] = useState(false)

  return (
    <BoardDndContext board={board} mutations={mutations}>
      <div className="flex-1 overflow-auto p-6 bg-background">
        <div className="min-w-[800px]">
          {board.groups.map((group) => (
            <SortableGroup key={group.id} id={group.id}>
              <div className="mb-6">
                <GroupHeader group={group} mutations={mutations} />
                {!group.collapsed && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="flex bg-muted/50 border-b border-border">
                      <div className="w-10 px-2 py-2 flex-shrink-0" />
                      <div className="min-w-[250px] flex-1 px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                        Item
                      </div>
                      {board.columns.map((col) => (
                        <ColumnHeader
                          key={col.id}
                          column={col}
                          onDelete={() => mutations.deleteColumn.mutate(col.id)}
                        />
                      ))}
                      <div className="w-10 flex-shrink-0 flex items-center justify-center">
                        <button
                          onClick={() => setAddColumnOpen(true)}
                          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Add column"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {group.items?.map((item) => (
                      <SortableItem key={item.id} id={item.id}>
                        <ItemRow
                          item={item}
                          columns={board.columns}
                          mutations={mutations}
                          members={board.members}
                          groupColor={group.color}
                        />
                      </SortableItem>
                    ))}
                    <AddItemRow groupId={group.id} mutations={mutations} groupColor={group.color} />
                  </div>
                )}
              </div>
            </SortableGroup>
          ))}
          <AddGroupButton mutations={mutations} />
        </div>

        <AddColumnDialog open={addColumnOpen} onOpenChange={setAddColumnOpen} mutations={mutations} />
      </div>
    </BoardDndContext>
  )
}
