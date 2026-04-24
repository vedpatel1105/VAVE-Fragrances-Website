import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Add protected routes that require authentication
const protectedRoutes = [
  '/checkout',
  '/profile',
  '/my-orders',
  '/wishlist',
  '/order-success',
  '/track-order',
  '/track-order/:path*',
  '/admin',
  '/admin/:path*',
  '/settings',
]

// Add auth routes that should redirect to home if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a response to modify
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  // Store original URL to redirect after login
  const redirectToOriginalUrl = (redirectTo: string = '/auth/login') => {
    const redirectUrl = new URL(redirectTo, request.url)
    if (pathname !== '/auth/login') {
      redirectUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // Check if the path matches any protected route pattern
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes(':path*')) {
      const basePath = route.split('/:path*')[0]
      return pathname.startsWith(basePath)
    }
    return pathname === route
  })

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => pathname === route)

  // Handle protected routes
  if (isProtectedRoute) {
    if (!session) {
      return redirectToOriginalUrl()
    }

    // Special handling for admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin') {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (!data || (data.role !== 'admin' && data.role !== 'viewer')) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  // Handle auth routes - redirect to home if already authenticated
  if (isAuthRoute && session) {
    // Check if there's a redirect URL in the query params
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // Return the response with the session
  return res
}

export const config = {
  matcher: [
    '/checkout',
    '/profile',
    '/my-orders',
    '/wishlist',
    '/order-success',
    '/track-order',
    '/track-order/:path*',
    '/admin',
    '/admin/:path*',
    '/settings',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ]
}