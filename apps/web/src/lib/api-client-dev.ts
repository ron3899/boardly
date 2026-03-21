import { mockApi } from './mock-data'

// Use empty string for same-origin requests (proxied via Next.js rewrites to localhost:3001)
// Or use NEXT_PUBLIC_API_URL if explicitly set (e.g., for production)
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // If mock API is enabled, route to mock handlers
  if (USE_MOCK_API) {
    return handleMockRequest<T>(path, options)
  }

  // Otherwise, use real API
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, body.error || 'Something went wrong')
  }

  return res.json()
}

// Mock request handler
async function handleMockRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = options.method || 'GET'
  const body = options.body ? JSON.parse(options.body as string) : undefined

  try {
    // Auth routes
    if (path === '/auth/me' && method === 'GET') {
      // Check for token cookie
      if (typeof document !== 'undefined' && document.cookie.includes('token=')) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300))
        const { mockUser } = await import('./mock-data')
        return { user: mockUser } as T
      }
      throw new ApiError(401, 'Not authenticated')
    }
    if (path === '/auth/login' && method === 'POST') {
      // Validate credentials
      const { email, password } = body
      if (email === 'demo@boardly.com' && password === 'demo1234') {
        // Set token cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'token=mock-token-demo; path=/; max-age=604800'
        }
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        const { mockUser } = await import('./mock-data')
        return { user: mockUser, token: 'mock-token-demo' } as T
      }
      throw new ApiError(401, 'Invalid credentials')
    }
    if (path === '/auth/register' && method === 'POST') {
      return (await mockApi.auth.register(body)) as T
    }
    if (path === '/auth/logout' && method === 'POST') {
      // Clear token cookie
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; path=/; max-age=0'
      }
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      return {} as T
    }

    // Board routes
    if (path === '/boards' && method === 'GET') {
      return (await mockApi.boards.list()) as T
    }
    if (path === '/boards' && method === 'POST') {
      return (await mockApi.boards.create(body)) as T
    }
    if (path.startsWith('/boards/') && method === 'GET') {
      const id = path.split('/')[2]
      return (await mockApi.boards.get(id)) as T
    }
    if (path.startsWith('/boards/') && method === 'PATCH') {
      const id = path.split('/')[2]
      return (await mockApi.boards.update(id, body)) as T
    }
    if (path.startsWith('/boards/') && method === 'DELETE') {
      const id = path.split('/')[2]
      return (await mockApi.boards.delete(id)) as T
    }

    // Board groups routes
    if (path.includes('/boards/') && path.includes('/groups') && method === 'POST') {
      const boardId = path.split('/')[2]
      return (await mockApi.groups.create(boardId, body)) as T
    }

    // Board columns routes
    if (path.includes('/boards/') && path.includes('/columns') && method === 'POST') {
      const boardId = path.split('/')[2]
      return (await mockApi.columns.create(boardId, body)) as T
    }

    // Group routes
    if (path.startsWith('/groups/') && path.endsWith('/items') && method === 'POST') {
      const groupId = path.split('/')[2]
      return (await mockApi.items.create(groupId, body)) as T
    }
    if (path.startsWith('/groups/') && method === 'PATCH') {
      const id = path.split('/')[2]
      return (await mockApi.groups.update(id, body)) as T
    }
    if (path.startsWith('/groups/') && method === 'DELETE') {
      const id = path.split('/')[2]
      return (await mockApi.groups.delete(id)) as T
    }
    if (path === '/groups/reorder' && method === 'PATCH') {
      return (await mockApi.groups.reorder(body)) as T
    }

    // Item routes
    if (path.startsWith('/items/') && path.includes('/values/') && method === 'PATCH') {
      const parts = path.split('/')
      const itemId = parts[2]
      const columnId = parts[4]
      return (await mockApi.items.updateValue(itemId, columnId, body)) as T
    }
    if (path.startsWith('/items/') && method === 'PATCH') {
      const id = path.split('/')[2]
      return (await mockApi.items.update(id, body)) as T
    }
    if (path.startsWith('/items/') && method === 'DELETE') {
      const id = path.split('/')[2]
      return (await mockApi.items.delete(id)) as T
    }
    if (path === '/items/reorder' && method === 'PATCH') {
      return (await mockApi.items.reorder(body)) as T
    }

    // Column routes
    if (path.startsWith('/columns/') && method === 'DELETE') {
      const id = path.split('/')[2]
      return (await mockApi.columns.delete(id)) as T
    }

    throw new ApiError(404, `Mock endpoint not found: ${method} ${path}`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, (error as Error).message)
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export { ApiError }
