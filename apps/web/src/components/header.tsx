'use client'

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-8 py-5 bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="flex items-center gap-3">{children}</div>
    </header>
  )
}
