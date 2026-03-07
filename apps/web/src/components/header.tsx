'use client'

import { Search, Bell, HelpCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-monday-border bg-white px-6 py-3 shadow-sm">
      {/* Left: Page title */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-monday-text-primary">{title}</h2>
      </div>

      {/* Right: Search, actions, notifications, user */}
      <div className="flex items-center gap-3">
        {/* Actions slot (for buttons like "New Board", etc.) */}
        {children}

        {/* Search bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-monday-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-full bg-monday-purple-light pl-10 pr-4 text-sm text-monday-text-primary placeholder:text-monday-text-muted focus:outline-none focus:ring-2 focus:ring-monday-purple transition-all"
          />
        </div>

        {/* Help icon */}
        <button
          className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-monday-text-secondary hover:bg-monday-purple-light transition-colors"
          title="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          className="relative h-8 w-8 flex items-center justify-center rounded-lg text-monday-text-secondary hover:bg-monday-purple-light transition-colors"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-monday-red"></span>
        </button>

        {/* User avatar */}
        <button
          className="h-8 w-8 flex items-center justify-center rounded-full bg-monday-purple text-white text-sm font-semibold hover:ring-2 hover:ring-monday-purple hover:ring-offset-2 transition-all"
          title={user?.name || 'User'}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  )
}
