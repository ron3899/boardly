import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // In mock API mode, skip auth checks (auth will be handled client-side)
  const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

  if (useMockApi) {
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
