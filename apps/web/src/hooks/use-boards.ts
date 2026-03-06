'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { Board, CreateBoardInput } from '@boardly/shared'

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => api.get<{ boards: Board[] }>('/boards'),
    select: (data) => data.boards,
  })
}

export function useCreateBoard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBoardInput) => api.post<{ board: Board }>('/boards', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}

export function useDeleteBoard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (boardId: string) => api.delete(`/boards/${boardId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}
