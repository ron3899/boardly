'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import type { User, AuthResponse } from '@boardly/shared'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<{ user: User }>('/auth/me'),
    retry: false,
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
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
