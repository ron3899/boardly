'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to boards - no login required
    router.replace('/app/boards')
  }, [router])

  return null
}
