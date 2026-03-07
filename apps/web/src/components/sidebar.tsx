'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
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
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg hover:bg-accent monday-transition"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 border-r bg-[hsl(var(--monday-dark))] text-white transition-transform md:translate-x-0',
          collapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Header */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg monday-gradient flex items-center justify-center monday-shadow">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Boardly</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <Link
              href="/app"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium monday-transition',
                pathname === '/app'
                  ? 'bg-white/10 text-white monday-shadow-sm'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              )}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              <span>Dashboard</span>
            </Link>
          </nav>

          {/* User Profile */}
          <div className="border-t border-white/10 px-3 py-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 monday-transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-full monday-gradient monday-shadow-sm text-sm font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{user?.name}</p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 rounded-lg hover:bg-white/10 monday-transition text-white/60 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
