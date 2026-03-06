const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export interface HealthStatus {
  isHealthy: boolean
  status?: string
  error?: string
  latency?: number
}

/**
 * Check if the API is healthy and responsive
 * @param retries Number of retry attempts
 * @returns Health status object
 */
export async function checkApiHealth(retries = MAX_RETRIES): Promise<HealthStatus> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const startTime = Date.now()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      })

      clearTimeout(timeoutId)
      const latency = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        return {
          isHealthy: true,
          status: data.status,
          latency,
        }
      }

      // If not OK, try again
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        continue
      }

      return {
        isHealthy: false,
        error: `API returned status ${response.status}`,
      }
    } catch (error) {
      if (attempt < retries) {
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        continue
      }

      return {
        isHealthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  return {
    isHealthy: false,
    error: 'Max retries reached',
  }
}

/**
 * Check if the API is available (quick check without retries)
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(`${API_URL}/ping`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}
