'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Item } from '@boardly/shared'
import type { useBoardMutations } from '@/hooks/use-board-mutations'

interface KanbanCardProps {
  item: Item & { groupId: string }
  mutations: ReturnType<typeof useBoardMutations>
}

export function KanbanCard({ item }: KanbanCardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const openDetail = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('item', item.id)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
      onClick={openDetail}
      className="bg-card text-card-foreground border border-border rounded-lg p-3 cursor-pointer hover:shadow-md dark:shadow-black/20 transition-shadow"
    >
      <p className="text-sm font-medium">{item.name}</p>
    </div>
  )
}
