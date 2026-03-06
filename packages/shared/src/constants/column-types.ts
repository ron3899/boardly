export const ColumnType = {
  TEXT: 'text',
  NUMBER: 'number',
  STATUS: 'status',
  DATE: 'date',
  PERSON: 'person',
  DROPDOWN: 'dropdown',
} as const

export type ColumnType = (typeof ColumnType)[keyof typeof ColumnType]

export const COLUMN_TYPES = Object.values(ColumnType)

export const DEFAULT_STATUS_LABELS: Record<string, { color: string; label: string }> = {
  todo: { color: '#c4c4c4', label: 'To Do' },
  in_progress: { color: '#fdab3d', label: 'Working on it' },
  done: { color: '#00c875', label: 'Done' },
  stuck: { color: '#e2445c', label: 'Stuck' },
}
