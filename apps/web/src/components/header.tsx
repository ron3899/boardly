'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface HeaderProps {
  title: string
  children?: React.ReactNode
  showSearch?: boolean
}

export function Header({ title, children, showSearch = true }: HeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-4 bg-white">
      <h2 className="text-lg font-semibold font-['Poppins']">{title}</h2>

      <div className="flex items-center gap-4">
        {showSearch && (
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </form>
        )}
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  )
}
