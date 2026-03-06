import { z } from 'zod'

export const createItemSchema = z.object({
  name: z.string().min(1).max(500),
})

export const updateItemSchema = z.object({
  name: z.string().min(1).max(500).optional(),
})

export const reorderItemsSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number(),
    groupId: z.string().optional(),
  })
)

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>
