'use client'

import { Search, Bell, HelpCircle, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  title: string
  breadcrumb?: string
  children?: React.ReactNode
}

export function Header({ title, breadcrumb, children }: HeaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  // Navigate to search page on Enter or after debounce
  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(value.trim())}`)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    // Set new timeout for debounced search
    if (value.trim()) {
      const timeout = setTimeout(() => {
        handleSearch(value)
      }, 500)
      setDebounceTimeout(timeout)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      handleSearch(searchValue)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [debounceTimeout])

  return (
    <header className="sticky top-0 z-30 bg-[hsl(var(--header-bg))] border-b border-border h-[60px] flex items-center px-6">
      <div className="flex-1 flex items-center gap-4">
        {/* Page Title and Breadcrumb */}
        <div className="flex flex-col">
          {breadcrumb && (
            <span className="text-xs text-muted-foreground font-medium">{breadcrumb}</span>
          )}
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 justify-center max-w-md">
        <div className="relative w-full max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full h-9 pl-10 pr-4 rounded-full bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-monday-purple/20 focus:border-monday-purple transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex-1 flex items-center justify-end gap-3">
        {children}

        {/* Icon Buttons */}
        <button
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px] text-muted-foreground" />
        </button>

        <button
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
          title="Help"
        >
          <HelpCircle className="h-[18px] w-[18px] text-muted-foreground" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-monday-purple to-monday-info text-white text-xs font-semibold cursor-pointer hover:ring-2 hover:ring-monday-purple/30 transition-all">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
