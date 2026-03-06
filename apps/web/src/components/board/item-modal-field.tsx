'use client'

import type { Column, BoardMember, User } from '@boardly/shared'
import { Cell } from './table/cell'

interface ItemModalFieldProps {
  column: Column
  value: unknown
  onChange: (value: unknown) => void
  members: (BoardMember & { user: Pick<User, 'id' | 'name' | 'email'> })[]
}

export function ItemModalField({ column, value, onChange, members }: ItemModalFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1 block">
        {column.name}
      </label>
      <Cell column={column} value={value} onChange={onChange} members={members} />
    </div>
  )
}
