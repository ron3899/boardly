'use client'

import type { Column, BoardMember, User } from '@boardly/shared'
import { TextCell } from './cells/text-cell'
import { NumberCell } from './cells/number-cell'
import { StatusCell } from './cells/status-cell'
import { DateCell } from './cells/date-cell'
import { PersonCell } from './cells/person-cell'
import { DropdownCell } from './cells/dropdown-cell'

interface CellProps {
  column: Column
  value: unknown
  onChange: (value: unknown) => void
  members: (BoardMember & { user: Pick<User, 'id' | 'name' | 'email'> })[]
}

export function Cell({ column, value, onChange, members }: CellProps) {
  const cellProps = { value, onChange }

  return (
    <div className="w-[160px] flex-shrink-0 px-1 py-1">
      {column.type === 'text' && <TextCell {...cellProps} />}
      {column.type === 'number' && <NumberCell {...cellProps} />}
      {column.type === 'status' && <StatusCell {...cellProps} settings={column.settings} />}
      {column.type === 'date' && <DateCell {...cellProps} />}
      {column.type === 'person' && <PersonCell {...cellProps} members={members} />}
      {column.type === 'dropdown' && <DropdownCell {...cellProps} settings={column.settings} />}
    </div>
  )
}
