'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">
          {error.message || 'An error occurred while loading this page.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/app'}>
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
