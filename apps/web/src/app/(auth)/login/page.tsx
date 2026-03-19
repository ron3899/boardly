'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const IS_MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
const DEMO_EMAIL = 'demo@boardly.com'
const DEMO_PASSWORD = 'demo1234'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginError } = useAuth()
  const [loading, setLoading] = useState(IS_MOCK_MODE) // Auto-start loading in mock mode
  const [showForm, setShowForm] = useState(!IS_MOCK_MODE) // Hide form initially in mock mode
  const [autoLoginFailed, setAutoLoginFailed] = useState(false)

  // Auto-login in mock mode
  useEffect(() => {
    if (IS_MOCK_MODE && !showForm && !autoLoginFailed) {
      const autoLogin = async () => {
        try {
          await login({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
          // Success - will redirect via useAuth hook
        } catch (error) {
          // Auto-login failed, show the form
          console.error('Auto-login failed:', error)
          setAutoLoginFailed(true)
          setShowForm(true)
          setLoading(false)
        }
      }

      // Small delay to show the loading message
      const timer = setTimeout(autoLogin, 500)
      return () => clearTimeout(timer)
    }
  }, [login, showForm, autoLoginFailed])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
    } catch {
      // error is in loginError
    } finally {
      setLoading(false)
    }
  }

  const handleDevLogin = async () => {
    setLoading(true)
    try {
      await login({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
    } catch {
      // error is in loginError
    } finally {
      setLoading(false)
    }
  }

  // Show loading state during auto-login
  if (IS_MOCK_MODE && !showForm) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
              <p className="text-lg font-medium">Signing in...</p>
              <p className="text-sm text-muted-foreground">Setting up demo environment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Boardly</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-destructive">{loginError.message}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          {IS_MOCK_MODE && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Development Mode</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleDevLogin}
                disabled={loading}
              >
                🚀 Quick Login (Demo)
              </Button>
              {autoLoginFailed && (
                <p className="mt-2 text-xs text-yellow-600">
                  Auto-login failed. Please use the form above or click Quick Login.
                </p>
              )}
            </div>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
