'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // In mock mode, redirect directly to /app
    // Otherwise, redirect to /login
    if (USE_MOCK_API) {
      router.push('/app')
    } else {
      router.push('/login')
    }
  }, [router])

  // Show landing page while redirecting
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Boardly</h1>
      <p className="text-muted-foreground mb-8">Work management platform</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90"
        >
          Register
        </Link>
      </div>
    </div>
  )
}
