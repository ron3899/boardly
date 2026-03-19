'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import type { User, AuthResponse } from '@boardly/shared'

// Mock user for development/demo mode
const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@boardly.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

  // In mock mode, return a pre-authenticated mock user
  if (useMockApi) {
    return {
      user: MOCK_USER,
      isLoading: false,
      isAuthenticated: true,
      login: async () => ({ user: MOCK_USER, token: 'mock-token' }),
      register: async () => ({ user: MOCK_USER, token: 'mock-token' }),
      logout: async () => {
        router.push('/login')
      },
      checkAuth: async () => ({ data: { user: MOCK_USER } }),
      loginError: null,
      registerError: null,
    }
  }

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
