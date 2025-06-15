import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Create a Supabase client configured to use cookies
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // If we're on the admin login page
  if (path === "/admin") {
    // If we have a session, redirect to orders page
    if (session) {
      const redirectUrl = new URL("/admin/orders", request.url)
      return NextResponse.redirect(redirectUrl)
    }
    // If no session, allow access to login page
    return res
  }

  // For admin routes except /admin/orders
  if (path.startsWith("/admin") && path !== "/admin/orders") {
    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL("/admin", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // For /admin/orders path, just check session and let the page handle admin role check
  if (path === "/admin/orders") {
    if (!session) {
      const redirectUrl = new URL("/admin", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Return the response with the session cookie
  return res
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ]
}
