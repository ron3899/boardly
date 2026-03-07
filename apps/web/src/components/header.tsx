'use client'

import { Search, Bell, HelpCircle, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface HeaderProps {
  title: string
  breadcrumb?: string
  children?: React.ReactNode
}

export function Header({ title, breadcrumb, children }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E6E9EF] h-[60px] flex items-center px-6">
      <div className="flex-1 flex items-center gap-4">
        {/* Page Title and Breadcrumb */}
        <div className="flex flex-col">
          {breadcrumb && (
            <span className="text-xs text-[#9699A6] font-medium">{breadcrumb}</span>
          )}
          <h2 className="text-[15px] font-semibold text-[#323338]">{title}</h2>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 justify-center max-w-md">
        <div className="relative w-full max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#676879]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-9 pl-10 pr-4 rounded-full bg-[#F6F7FB] border border-[#E6E9EF] text-sm text-[#323338] placeholder:text-[#9699A6] focus:outline-none focus:ring-2 focus:ring-monday-purple/20 focus:border-monday-purple transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex-1 flex items-center justify-end gap-3">
        {children}

        {/* Icon Buttons */}
        <button
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F6F7FB] transition-colors"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px] text-[#676879]" />
        </button>

        <button
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F6F7FB] transition-colors"
          title="Help"
        >
          <HelpCircle className="h-[18px] w-[18px] text-[#676879]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-monday-purple to-monday-info text-white text-xs font-semibold cursor-pointer hover:ring-2 hover:ring-monday-purple/30 transition-all">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
