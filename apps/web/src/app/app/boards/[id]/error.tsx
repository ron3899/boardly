'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Board error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Failed to load board</h2>
        <p className="text-muted-foreground">
          {error.message || 'There was a problem loading this board. It may have been deleted or you may not have access to it.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="outline" onClick={() => router.push('/app')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
