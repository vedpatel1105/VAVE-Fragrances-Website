import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add protected routes that require authentication
const protectedRoutes = [
  '/checkout',
  '/profile',
  '/my-orders',
  '/wishlist',
  '/order-success',
  '/track-order',
  '/admin',
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
  
  // We need to create a response first so we can set cookies on it
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh the session if it's expired
  const { data: { user } } = await supabase.auth.getUser()

  // Helper to redirect to login with the current path as a redirect param
  const redirectToLogin = () => {
    const redirectUrl = new URL('/auth/login', request.url)
    const fullPath = request.nextUrl.search ? `${pathname}${request.nextUrl.search}` : pathname
    redirectUrl.searchParams.set('redirect', fullPath)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.endsWith('/:path*')) {
      const basePath = route.replace('/:path*', '')
      return pathname.startsWith(basePath)
    }
    return pathname === route || pathname.startsWith(route + '/')
  })

  // Handle protected routes
  if (isProtectedRoute) {
    if (!user) {
      return redirectToLogin()
    }

    // Special handling for admin routes
    if (pathname.startsWith('/admin')) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'viewer')) {
        // If not an admin but trying to access deep admin routes, redirect to main admin or home
        if (pathname !== '/admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
    }
  }

  // Handle auth routes - redirect to home/profile if already authenticated
  const isAuthRoute = authRoutes.some(route => pathname === route)
  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/profile'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}