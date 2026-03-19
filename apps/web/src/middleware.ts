import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // In mock API mode OR development, completely bypass all auth checks
  const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (useMockApi || isDevelopment) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  // Only protect /app routes - redirect to login if no token
  if (request.nextUrl.pathname.startsWith('/app') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/login', '/register'],
}
