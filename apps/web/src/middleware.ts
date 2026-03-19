import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// No-op middleware - no auth checks, no redirects
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Match nothing - effectively disables middleware
export const config = {
  matcher: [],
}
