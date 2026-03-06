import { z } from 'zod'

export const updateColumnValueSchema = z.object({
  value: z.unknown(),
})

export type UpdateColumnValueInput = z.infer<typeof updateColumnValueSchema>
