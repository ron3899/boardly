'use client'

import type { User } from '@boardly/shared'

// Hardcoded demo user - no authentication required
const DEMO_USER: User = {
  id: '1',
  email: 'demo@boardly.com',
  name: 'Demo User',
  createdAt: new Date().toISOString(),
}

export function useAuth() {
  // Return demo user immediately without any API calls
  return {
    user: DEMO_USER,
    isLoading: false,
    isAuthenticated: true,
    login: async () => {}, // No-op
    register: async () => {}, // No-op
    logout: async () => {}, // No-op
    checkAuth: async () => ({ data: { user: DEMO_USER } }), // No-op that returns demo user
    loginError: null,
    registerError: null,
  }
}
