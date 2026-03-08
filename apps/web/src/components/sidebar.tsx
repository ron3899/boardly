'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  CheckSquare,
  LayoutGrid,
  Star,
  Bell,
  Search,
  Plus
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { CreateBoardDialog } from '@/components/create-board-dialog'

const navItems = [
  { href: '/app', icon: LayoutDashboard, label: 'Home' },
  { href: '/app/my-work', icon: CheckSquare, label: 'My Work' },
  { href: '/app/boards', icon: LayoutGrid, label: 'Boards' },
  { href: '/app/favorites', icon: Star, label: 'Favorites' },
]

const secondaryNavItems = [
  { href: '/app/inbox', icon: Bell, label: 'Inbox' },
  { href: '/app/search', icon: Search, label: 'Search' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-white bg-monday-dark p-2 rounded-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-[240px] bg-surface-mid border-r border-border-subtle transition-transform md:translate-x-0 flex flex-col',
          collapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo and Workspace */}
        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center shadow-md">
              <LayoutGrid className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-[15px] font-semibold text-text-primary">Boardly</h1>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-surface-light border border-border-subtle cursor-pointer hover:bg-surface-overlay transition-colors">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'W'}
            </div>
            <span className="text-xs font-medium text-text-primary truncate flex-1">My Workspace</span>
          </div>
        </div>

        {/* New Button */}
        <div className="px-3 py-3">
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-hover transition-all font-medium text-[13px] shadow-sm hover:shadow-md"
          >
            <Plus className="h-3.5 w-3.5" />
            New Board
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
          <div className="sidebar-section-header">
            <span>Main</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-item',
                  isActive && 'active'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}

          {/* Divider */}
          <div className="h-px bg-border-subtle my-2" />

          <div className="sidebar-section-header">
            <span>Tools</span>
          </div>
          {/* Secondary Navigation */}
          {secondaryNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-item',
                  isActive && 'active'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-border-subtle p-2">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-light transition-colors cursor-pointer group">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-purple-600 text-white text-[11px] font-bold ring-2 ring-transparent group-hover:ring-brand/20 transition-all">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate text-text-primary">{user?.name || 'User'}</p>
              <p className="text-[11px] text-text-disabled truncate">{user?.email || 'user@boardly.com'}</p>
            </div>
            <button
              onClick={() => logout()}
              className="flex-shrink-0 p-1 rounded hover:bg-surface-overlay transition-colors opacity-0 group-hover:opacity-100"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5 text-text-secondary" />
            </button>
          </div>
        </div>
      </aside>

      <CreateBoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
