'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { BoardWithDetails, Group, Item, Column, ColumnValue } from '@boardly/shared'

export function useBoardMutations(boardId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['board', boardId]

  const invalidate = () => queryClient.invalidateQueries({ queryKey })

  const updateBoardName = useMutation({
    mutationFn: (name: string) => api.patch(`/boards/${boardId}`, { name }),
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        return { board: { ...old.board, name } }
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev)
    },
    onSettled: invalidate,
  })

  const addGroup = useMutation({
    mutationFn: (name: string) => api.post<{ group: Group }>(`/boards/${boardId}/groups`, { name }),
    onSettled: invalidate,
  })

  const updateGroup = useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; color?: string; collapsed?: boolean }) =>
      api.patch(`/groups/${id}`, data),
    onMutate: async ({ id, ...data }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        return {
          board: {
            ...old.board,
            groups: old.board.groups.map((g: Group) =>
              g.id === id ? { ...g, ...data } : g
            ),
          },
        }
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev)
    },
    onSettled: invalidate,
  })

  const deleteGroup = useMutation({
    mutationFn: (groupId: string) => api.delete(`/groups/${groupId}`),
    onSettled: invalidate,
  })

  const addItem = useMutation({
    mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
      api.post<{ item: Item }>(`/groups/${groupId}/items`, { name }),
    onSettled: invalidate,
  })

  const updateItem = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch(`/items/${id}`, { name }),
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        return {
          board: {
            ...old.board,
            groups: old.board.groups.map((g: Group) => ({
              ...g,
              items: g.items?.map((item: Item) =>
                item.id === id ? { ...item, name } : item
              ),
            })),
          },
        }
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev)
    },
    onSettled: invalidate,
  })

  const deleteItem = useMutation({
    mutationFn: (itemId: string) => api.delete(`/items/${itemId}`),
    onSettled: invalidate,
  })

  const addColumn = useMutation({
    mutationFn: (input: { name: string; type: string; settings?: Record<string, unknown> }) =>
      api.post<{ column: Column }>(`/boards/${boardId}/columns`, input),
    onSettled: invalidate,
  })

  const deleteColumn = useMutation({
    mutationFn: (columnId: string) => api.delete(`/columns/${columnId}`),
    onSettled: invalidate,
  })

  const updateValue = useMutation({
    mutationFn: ({ itemId, columnId, value }: { itemId: string; columnId: string; value: unknown }) =>
      api.patch<{ columnValue: ColumnValue }>(`/items/${itemId}/values/${columnId}`, { value }),
    onMutate: async ({ itemId, columnId, value }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        return {
          board: {
            ...old.board,
            groups: old.board.groups.map((g: Group) => ({
              ...g,
              items: g.items?.map((item: Item) => {
                if (item.id !== itemId) return item
                const existing = item.columnValues?.find((cv: ColumnValue) => cv.columnId === columnId)
                if (existing) {
                  return {
                    ...item,
                    columnValues: item.columnValues?.map((cv: ColumnValue) =>
                      cv.columnId === columnId ? { ...cv, value } : cv
                    ),
                  }
                }
                return {
                  ...item,
                  columnValues: [...(item.columnValues || []), { id: 'temp', itemId, columnId, value }],
                }
              }),
            })),
          },
        }
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev)
    },
    onSettled: invalidate,
  })

  const reorderItems = useMutation({
    mutationFn: (items: { id: string; order: number; groupId?: string }[]) =>
      api.patch('/items/reorder', items),
    onSettled: invalidate,
  })

  const reorderGroups = useMutation({
    mutationFn: (groups: { id: string; order: number }[]) =>
      api.patch('/groups/reorder', groups),
    onSettled: invalidate,
  })

  return {
    updateBoardName,
    addGroup,
    updateGroup,
    deleteGroup,
    addItem,
    updateItem,
    deleteItem,
    addColumn,
    deleteColumn,
    updateValue,
    reorderItems,
    reorderGroups,
  }
}
