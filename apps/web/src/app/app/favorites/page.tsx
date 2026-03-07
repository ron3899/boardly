'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Star, Plus } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const [favorites] = useState<any[]>([])

  return (
    <div className="flex flex-col h-full">
      <Header title="Favorites">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>{favorites.length} favorites</span>
        </div>
      </Header>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
          <div className="mb-6 p-4 rounded-full bg-primary/10">
            <Star className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Star your most important boards to access them quickly from here.
            Look for the star icon on any board to add it to your favorites.
          </p>
          <Link href="/app">
            <Button className="bg-[#6161FF] hover:bg-[#5151EF]">
              <Plus className="h-4 w-4 mr-2" />
              Browse Boards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
