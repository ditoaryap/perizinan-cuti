import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page and root
  if (pathname === "/login" || pathname === "/") {
    return NextResponse.next()
  }

  // Check for token in cookies or headers
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
