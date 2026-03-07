'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Menu, X, CheckSquare, Star, Inbox, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { href: '/app', label: 'Home', icon: LayoutDashboard },
    { href: '/app/my-work', label: 'My Work', icon: CheckSquare },
    { href: '/app/favorites', label: 'Favorites', icon: Star },
    { href: '/app/inbox', label: 'Inbox', icon: Inbox },
    { href: '/app/search', label: 'Search', icon: Search },
  ]

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 border-r transition-transform md:translate-x-0',
          'bg-[#1C1F3B] text-white',
          collapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
            <h1 className="text-xl font-bold text-[#6161FF] font-['Poppins']">Boardly</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10',
                    isActive ? 'bg-[#6161FF] text-white' : 'text-white/80'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 px-3 py-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6161FF] text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{user?.name}</p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()} className="hover:bg-white/10 text-white">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
