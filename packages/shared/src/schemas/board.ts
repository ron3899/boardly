import { z } from 'zod'

export const createBoardSchema = z.object({
  name: z.string().min(1).max(200),
  groups: z.array(
    z.object({
      name: z.string().min(1).max(200),
      color: z.string().optional(),
    })
  ).min(1).max(10).optional(),
})

export const updateBoardSchema = z.object({
  name: z.string().min(1).max(200).optional(),
})

export type CreateBoardInput = z.infer<typeof createBoardSchema>
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>
