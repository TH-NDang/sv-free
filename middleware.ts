import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookies = getSessionCookie(request);

  const isLoggedIn = !!cookies;
  const isOnLogin = request.nextUrl.pathname.startsWith("/auth/sign-in");
  const isOnSignup = request.nextUrl.pathname.startsWith("/auth/register");

  const testRoutes = [""];
  const protectedRoutes = ["/my-library", "/settings", "/documents/upload"];

  if (isLoggedIn && (isOnLogin || isOnSignup)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isOnLogin || testRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/my-library", request.url));
  }

  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/:id", "/api/:path*", "/auth/:path*", "/documents/:path*"],
};
