import { z } from 'zod'
import { COLUMN_TYPES } from '../constants/column-types'

export const createColumnSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(COLUMN_TYPES as [string, ...string[]]),
  settings: z.record(z.unknown()).optional(),
})

export const updateColumnSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  settings: z.record(z.unknown()).optional(),
})

export type CreateColumnInput = z.infer<typeof createColumnSchema>
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>
