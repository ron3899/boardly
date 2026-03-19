'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import type { User, AuthResponse } from '@boardly/shared'

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // In mock mode, skip API calls and return hardcoded demo user immediately
  if (USE_MOCK_API) {
    const demoUser: User = {
      id: '1',
      email: 'demo@boardly.com',
      name: 'Demo User',
      createdAt: new Date().toISOString(),
    }

    const loginMutation = useMutation({
      mutationFn: async (input: { email: string; password: string }) => {
        // Set cookie for compatibility
        if (typeof document !== 'undefined') {
          document.cookie = 'token=mock-token-demo; path=/; max-age=86400'
        }
        return { user: demoUser, token: 'mock-token-demo' }
      },
      onSuccess: () => {
        router.push('/app')
      },
    })

    const registerMutation = useMutation({
      mutationFn: async (input: { email: string; password: string; name: string }) => {
        if (typeof document !== 'undefined') {
          document.cookie = 'token=mock-token-demo; path=/; max-age=86400'
        }
        return { user: demoUser, token: 'mock-token-demo' }
      },
      onSuccess: () => {
        router.push('/app')
      },
    })

    const logoutMutation = useMutation({
      mutationFn: async () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; max-age=0'
        }
        return {}
      },
      onSuccess: () => {
        router.push('/login')
      },
    })

    return {
      user: demoUser,
      isLoading: false,
      isAuthenticated: true,
      login: loginMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      logout: logoutMutation.mutateAsync,
      checkAuth: async () => ({ data: { user: demoUser } }),
      loginError: loginMutation.error,
      registerError: registerMutation.error,
    }
  }

  // Production mode - use real API
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<{ user: User }>('/auth/me'),
    retry: false,
    enabled: false, // Disable automatic authentication check - users must explicitly login
  })

  const loginMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      api.post<AuthResponse>('/auth/login', input),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], { user: data.user })
      router.push('/app')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (input: { email: string; password: string; name: string }) =>
      api.post<AuthResponse>('/auth/register', input),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], { user: data.user })
      router.push('/app')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    },
  })

  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated: !!data?.user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    checkAuth: refetch, // Manual method to check authentication status
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
