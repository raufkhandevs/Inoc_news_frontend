import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add routes that require authentication
const protectedRoutes = ["/preferences"]

// Add routes that should not be accessible when authenticated
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")
  const { pathname } = request.nextUrl

  // If trying to access protected route without being authenticated
  if (protectedRoutes.includes(pathname) && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If trying to access auth routes while being authenticated
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [...protectedRoutes, ...authRoutes],
}

