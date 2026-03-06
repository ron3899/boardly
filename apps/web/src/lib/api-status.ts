/**
 * API Status Manager
 * Monitors API availability and manages fallback modes
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const CHECK_INTERVAL = 30000 // 30 seconds
const HEALTH_TIMEOUT = 3000 // 3 seconds

export type ApiStatus = 'connected' | 'disconnected' | 'checking' | 'unknown'

type StatusListener = (status: ApiStatus) => void

class ApiStatusManager {
  private status: ApiStatus = 'unknown'
  private listeners: Set<StatusListener> = new Set()
  private checkIntervalId: NodeJS.Timeout | null = null
  private lastCheckTime: number = 0

  constructor() {
    if (typeof window !== 'undefined') {
      // Initial check
      this.checkHealth()

      // Periodic checks
      this.startPeriodicChecks()

      // Check on window focus
      window.addEventListener('focus', () => {
        if (Date.now() - this.lastCheckTime > 5000) {
          this.checkHealth()
        }
      })
    }
  }

  private startPeriodicChecks() {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId)
    }

    this.checkIntervalId = setInterval(() => {
      this.checkHealth()
    }, CHECK_INTERVAL)
  }

  async checkHealth(): Promise<ApiStatus> {
    this.lastCheckTime = Date.now()

    // Don't spam checks
    if (this.status === 'checking') {
      return this.status
    }

    this.setStatus('checking')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT)

      const response = await fetch(`${API_URL}/ping`, {
        signal: controller.signal,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        this.setStatus('connected')
        return 'connected'
      } else {
        this.setStatus('disconnected')
        return 'disconnected'
      }
    } catch (error) {
      console.warn('API health check failed:', error)
      this.setStatus('disconnected')
      return 'disconnected'
    }
  }

  private setStatus(newStatus: ApiStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus
      this.notifyListeners()
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.status)
      } catch (error) {
        console.error('Error in status listener:', error)
      }
    })
  }

  getStatus(): ApiStatus {
    return this.status
  }

  isConnected(): boolean {
    return this.status === 'connected'
  }

  subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener)
    // Call immediately with current status
    listener(this.status)

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  destroy() {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId)
      this.checkIntervalId = null
    }
    this.listeners.clear()
  }
}

// Singleton instance
export const apiStatusManager = new ApiStatusManager()

// React hook for using API status
export function useApiStatus() {
  if (typeof window === 'undefined') {
    return { status: 'unknown' as ApiStatus, isConnected: false }
  }

  const [status, setStatus] = React.useState<ApiStatus>(apiStatusManager.getStatus())

  React.useEffect(() => {
    const unsubscribe = apiStatusManager.subscribe(setStatus)
    return unsubscribe
  }, [])

  return {
    status,
    isConnected: status === 'connected',
  }
}

// For use outside React components
export { apiStatusManager as default }

// Import React if available
let React: any
if (typeof window !== 'undefined') {
  try {
    React = require('react')
  } catch {
    // React not available
  }
}
