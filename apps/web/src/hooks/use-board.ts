'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { BoardWithDetails } from '@boardly/shared'

export function useBoard(boardId: string) {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => api.get<{ board: BoardWithDetails }>(`/boards/${boardId}`),
    select: (data) => data.board,
    enabled: !!boardId,
  })
}
