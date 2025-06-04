import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for the admin area (excluding the login page)
  const isAdminPath = path.startsWith("/admin") && path !== "/admin"

  // Check if the user is authenticated by looking for the adminAuth cookie
  const adminAuth = request.cookies.get("adminAuth")?.value

  // If the user is trying to access admin pages without being authenticated
  if (isAdminPath && !adminAuth) {
    // Redirect to the admin login page
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
