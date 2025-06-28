import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page, root, and all static files in public
  if (
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/logo-kementan.png") ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|gif)$/)
  ) {
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
