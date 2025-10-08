import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /dashboard, /dashboard/ideas)
  const path = request.nextUrl.pathname

  // Check if the path starts with /dashboard
  const isDashboardPath = path.startsWith('/dashboard')
  
  // Check if the path is login or signup
  const isAuthPath = path.startsWith('/login') || path.startsWith('/signup')

  // Get the token from cookies
  const token = request.cookies.get('access_token')?.value || ''

  // If accessing dashboard routes without a token, redirect to login
  if (isDashboardPath && !token) {
    const loginUrl = new URL('/login', request.url)
    // Add a redirect parameter to return user to their intended destination after login
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login/signup with a token, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}