import type { ColumnType } from '../constants/column-types'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Board {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface BoardMember {
  id: string
  boardId: string
  userId: string
  role: 'owner' | 'member'
}

export interface Group {
  id: string
  boardId: string
  name: string
  color: string
  order: number
  collapsed: boolean
  items?: Item[]
}

export interface Item {
  id: string
  groupId: string
  name: string
  order: number
  columnValues?: ColumnValue[]
}

export interface Column {
  id: string
  boardId: string
  name: string
  type: ColumnType
  order: number
  settings: Record<string, unknown>
}

export interface ColumnValue {
  id: string
  itemId: string
  columnId: string
  value: unknown
}

export interface BoardWithDetails extends Board {
  groups: Group[]
  columns: Column[]
  members: (BoardMember & { user: Pick<User, 'id' | 'name' | 'email'> })[]
}

export interface AuthResponse {
  user: User
  token: string
}
