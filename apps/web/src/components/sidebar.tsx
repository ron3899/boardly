'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Menu, X, Layers, Search, Settings, Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-md monday-transition hover:shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <X className="h-5 w-5 text-monday-purple" /> : <Menu className="h-5 w-5 text-monday-purple" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200 transition-transform md:translate-x-0 shadow-lg',
          collapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section with Monday.com gradient accent */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-monday-purple/5 to-transparent">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-monday-purple to-monday-purple-dark">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Boardly</h1>
          </div>

          {/* Search Bar - Monday.com style */}
          <div className="px-3 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20 outline-none monday-transition"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
            <Link
              href="/app"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium monday-transition group',
                pathname === '/app'
                  ? 'bg-monday-purple text-white shadow-sm'
                  : 'text-gray-700 hover:bg-monday-purple-light hover:text-monday-purple'
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            {/* Quick Actions Section */}
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Actions
              </p>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium monday-transition text-gray-700 hover:bg-monday-purple-light hover:text-monday-purple w-full">
                <Plus className="h-5 w-5" />
                <span>Create Board</span>
              </button>
            </div>
          </nav>

          {/* User Section - Monday.com style */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 monday-transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-monday-purple to-monday-pink text-white text-sm font-bold shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="hover:bg-monday-red-light hover:text-monday-red"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
