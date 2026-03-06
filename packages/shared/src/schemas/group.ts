import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().min(1).max(200),
})

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  color: z.string().optional(),
  collapsed: z.boolean().optional(),
})

export const reorderGroupsSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number(),
  })
)

export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type ReorderGroupsInput = z.infer<typeof reorderGroupsSchema>
