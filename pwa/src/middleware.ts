import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { logger } from "@/lib/utils/Logger";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Get the token and user information
  const session = await getToken({ req });

  // Check if the user is authenticated
  const isAuthenticated = !!session;

  // Define protected routes
  const isAdminRoute = path.startsWith("/admin");
  const isAuthRoute = path === "/login";

  // Redirect logic based on authentication and roles
  if (isAuthRoute) {
    if (isAuthenticated) {
      // If user is already logged in and has ROLE_ADMIN, redirect to admin
      // if (session?.user?.roles?.includes("ROLE_ADMIN")) {
      //   return NextResponse.redirect(new URL("/admin", req.url));
      // }
      // Otherwise redirect to home
      return NextResponse.redirect(new URL("/", req.url));
    }
    // If not authenticated and trying to access login, allow
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check if user has admin role
    if (!session?.user?.roles?.includes("ROLE_ADMIN")) {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow admin access
    return NextResponse.next();
  }

  // For other protected routes, check authentication
  if (
    !isAuthenticated &&
    !path.startsWith("/_next") &&
    !path.includes("/api/auth")
  ) {
    // Redirect to login for protected routes
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Specify which routes middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
