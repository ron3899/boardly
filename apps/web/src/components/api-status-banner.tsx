'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react'

type ApiStatus = 'connected' | 'disconnected' | 'checking' | 'unknown'

export function ApiStatusBanner() {
  const [status, setStatus] = useState<ApiStatus>('unknown')
  const [showBanner, setShowBanner] = useState(false)
  const [useMockMode] = useState(() =>
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ||
     process.env.NEXT_PUBLIC_API_FALLBACK_TO_MOCK === 'true')
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkApiStatus = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ping`,
          {
            signal: controller.signal,
            method: 'GET',
            mode: 'cors',
          }
        )

        clearTimeout(timeoutId)

        if (response.ok) {
          setStatus('connected')
          setShowBanner(false)
        } else {
          setStatus('disconnected')
          setShowBanner(useMockMode)
        }
      } catch (error) {
        setStatus('disconnected')
        setShowBanner(useMockMode)
      }
    }

    // Initial check
    checkApiStatus()

    // Periodic checks every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)

    return () => clearInterval(interval)
  }, [useMockMode])

  if (!showBanner || status === 'connected') {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status === 'checking' ? (
              <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
            ) : status === 'disconnected' ? (
              <WifiOff className="h-5 w-5 text-yellow-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <div>
              <p className="text-sm font-medium text-yellow-800">
                {status === 'disconnected' && 'API Server Not Available'}
                {status === 'checking' && 'Checking API Connection...'}
                {status === 'unknown' && 'API Status Unknown'}
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Using local mock data. Changes won't be saved.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
