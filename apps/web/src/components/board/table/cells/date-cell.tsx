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
      className="w-full h-8 px-2 text-sm bg-background text-foreground border border-border rounded hover:bg-muted/50 cursor-pointer outline-none focus:border-primary"
    />
  )
}
