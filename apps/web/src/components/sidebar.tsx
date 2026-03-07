'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-monday-sidebar text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar - Monday.com dark navy style */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-monday-sidebar transition-all duration-300 ease-in-out md:translate-x-0',
          collapsed ? 'w-16' : 'w-[220px]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo area */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-monday-purple"></div>
                <h1 className="text-lg font-bold text-white">Boardly</h1>
              </div>
            )}
            {collapsed && (
              <div className="w-2 h-2 rounded-full bg-monday-purple mx-auto"></div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {/* Section header */}
            {!collapsed && (
              <div className="px-3 mb-2">
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                  My Work
                </p>
              </div>
            )}

            {/* Dashboard link */}
            <Link
              href="/app"
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                pathname === '/app'
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              title={collapsed ? 'Dashboard' : undefined}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            {/* Favorites section */}
            {!collapsed && (
              <div className="px-3 mb-2 mt-6">
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                  Favorites
                </p>
              </div>
            )}

            <button
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 w-full',
                'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              title={collapsed ? 'Recent' : undefined}
            >
              <Clock className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Recent boards</span>}
            </button>

            <button
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 w-full',
                'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              title={collapsed ? 'Starred' : undefined}
            >
              <Star className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Starred</span>}
            </button>
          </nav>

          {/* Add board button */}
          <div className="px-3 pb-3">
            <button
              className={cn(
                'flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                'bg-monday-orange hover:bg-monday-orange/90 text-white active:scale-95'
              )}
              title={collapsed ? 'Add board' : undefined}
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Add board</span>}
            </button>
          </div>

          {/* User section at bottom */}
          <div className="border-t border-white/10 px-3 py-3">
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg',
                collapsed ? 'justify-center' : ''
              )}
            >
              {/* User avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-monday-purple text-white text-sm font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {/* User info */}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-white/60 truncate">{user?.email}</p>
                </div>
              )}

              {/* Logout button */}
              {!collapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  className="h-7 w-7 hover:bg-white/10 text-white/70 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Collapse toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-white border border-monday-border shadow-md hover:bg-monday-bg transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3 text-monday-text-secondary" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-monday-text-secondary" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
