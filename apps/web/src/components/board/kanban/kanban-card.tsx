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
      className="bg-white border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:shadow-monday-hover hover:-translate-y-0.5 monday-transition group"
    >
      <p className="text-sm font-semibold text-gray-900 group-hover:text-monday-purple">{item.name}</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="h-1.5 w-1.5 rounded-full bg-monday-purple"></div>
        <span className="text-xs text-gray-500">Task</span>
      </div>
    </div>
  )
}
