import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // HARDCODED: Always use mock API mode in sandbox/preview environments
  // This ensures the app works without any .env files or real database
  // Auth is handled client-side via localStorage
  const useMockApi = true

  if (useMockApi) {
    // In mock mode, always allow access - auth is handled client-side
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  // Only protect /app routes - redirect to login if no token
  if (request.nextUrl.pathname.startsWith('/app') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Removed: Auto-redirect from login/register pages when token exists
  // Users must explicitly login even if they have a token cookie

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/login', '/register'],
}
