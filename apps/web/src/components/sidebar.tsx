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
          'fixed left-0 top-0 z-40 h-full w-[260px] transition-transform md:translate-x-0',
          collapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
      >
        <div className="flex h-full flex-col text-white">
          {/* Logo and Workspace */}
          <div className="px-4 py-5 border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-monday-purple to-monday-info flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Boardly</h1>
            </div>
            <p className="text-xs text-white/60 pl-10">My Workspace</p>
          </div>

          {/* New Button */}
          <div className="px-4 py-3">
            <button
              onClick={() => setCreateOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-monday-purple text-monday-purple hover:bg-monday-purple/10 transition-colors font-medium text-sm"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/90 hover:bg-white/8'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}

            {/* Divider */}
            <div className="h-px bg-white/10 my-3" />

            {/* Secondary Navigation */}
            {secondaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/90 hover:bg-white/8'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-monday-purple to-monday-info text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-white/60 truncate">{user?.email || 'user@boardly.com'}</p>
              </div>
              <button
                onClick={() => logout()}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <CreateBoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
