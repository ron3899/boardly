'use client'

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  )
}
