'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // In mock/dev mode, immediately redirect to app
    if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
      router.replace('/app')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to app...</p>
      </div>
    </div>
  )
}
