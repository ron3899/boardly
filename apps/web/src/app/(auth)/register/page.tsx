'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to boards - no registration required
    router.replace('/app/boards')
  }, [router])

  return null
}
