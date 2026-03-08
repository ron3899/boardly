'use client'

import { Search, Bell, HelpCircle, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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
    <header className="app-header">
      <div className="flex-1 flex items-center gap-4">
        {/* Page Title and Breadcrumb */}
        <div className="flex flex-col min-w-0">
          {breadcrumb && (
            <div className="header-breadcrumb">
              <span className="text-text-secondary">{breadcrumb}</span>
              <span className="text-text-secondary">/</span>
            </div>
          )}
          <h2 className="text-[15px] font-semibold text-text-primary truncate">{title}</h2>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 justify-center max-w-md">
        <div className="relative w-full max-w-[340px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-disabled" />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-surface-light border border-border-subtle text-[13px] text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:bg-surface-card transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex-1 flex items-center justify-end gap-2">
        {children}

        {/* Icon Buttons */}
        <button
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-light transition-colors text-text-secondary hover:text-text-primary"
          title="Notifications"
        >
          <Bell className="h-[17px] w-[17px]" />
        </button>

        <button
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-light transition-colors text-text-secondary hover:text-text-primary"
          title="Help"
        >
          <HelpCircle className="h-[17px] w-[17px]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand to-purple-600 text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-brand/30 transition-all shadow-sm">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
