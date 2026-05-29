import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware that forwards the httpOnly phi_token cookie as an
 * Authorization: Bearer header to upstream backend services via rewrites.
 *
 * Without this, Next.js rewrites strip cookies and don't add Authorization,
 * so backend services would receive unauthenticated requests.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("phi_token")?.value;

  // Only add Authorization for API proxy routes
  if (
    token &&
    (request.nextUrl.pathname.startsWith("/api/shiken/") ||
      request.nextUrl.pathname.startsWith("/api/mondai/") ||
      request.nextUrl.pathname.startsWith("/api/auth/"))
  ) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
