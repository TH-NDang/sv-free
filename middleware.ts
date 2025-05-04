import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Xử lý CORS cho các yêu cầu API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (request.nextUrl.pathname.startsWith("/api/proxy")) {
      const response = NextResponse.next();

      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      return response;
    }
  }

  const cookies = getSessionCookie(request);

  const isLoggedIn = !!cookies;
  const isOnLogin = request.nextUrl.pathname.startsWith("/auth/sign-in");
  const isOnSignup = request.nextUrl.pathname.startsWith("/auth/register");

  const protectedRoutes = ["/my-library", "/settings", "/documents/upload"];

  // Redirect from auth pages to home if already logged in
  if (isLoggedIn && (isOnLogin || isOnSignup)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For protected routes, check authentication
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  // For all other routes, just continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/:id", "/api/:path*", "/auth/:path*", "/documents/:path*"],
};
