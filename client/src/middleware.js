import { NextResponse } from "next/server";

export function middleware(req) {
  const accessToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname === "/" ||      // login page
    pathname === "/auth/signup";

  const isProtected =
    pathname.startsWith("/home") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/dashboard");

  // User NOT logged in → block protected pages
  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL("/", req.url)); // go to login
  }

  // User logged in → block login & signup
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",                 // LOGIN PAGE
    "/auth/signup",      
    "/home",
    "/chat/:path*",
    "/dashboard/:path*",
  ],
};
