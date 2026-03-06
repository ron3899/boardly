'use client'

interface DateCellProps {
  value: unknown
  onChange: (value: unknown) => void
}

export function DateCell({ value, onChange }: DateCellProps) {
  const dateStr = typeof value === 'string' ? value : ''

  return (
    <input
      type="date"
      value={dateStr}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full h-8 px-2 text-sm bg-transparent rounded hover:bg-accent cursor-pointer outline-none"
    />
  )
}
