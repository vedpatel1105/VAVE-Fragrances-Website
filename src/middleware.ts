import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Create a Supabase client configured to use cookies
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If we're on the admin login page
  if (path === "/admin") {
    // If we have a session, check if user is admin
    if (session) {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      // If user is admin, redirect to orders page
      if (!error && roleData && roleData.role === 'admin') {
        const redirectUrl = new URL("/admin/orders", request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
    // If no session or not admin, allow access to login page
    return res
  }

  // For all other admin routes
  if (path.startsWith("/admin")) {
    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL("/admin", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    // If not admin, redirect to home
    if (error || !roleData || roleData.role !== 'admin') {
      const redirectUrl = new URL("/", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If admin, allow access and return the response with updated session
    return res
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
