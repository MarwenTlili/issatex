import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ✅ Define role-based route access
// or move roleAccess to src/lib/config/role-access.ts
const roleAccess: Record<string, string[]> = {
  "/admin": ["ROLE_ADMIN"],
  "/client": ["ROLE_CLIENT"],
  "/secretaire": ["ROLE_SECRETARY"],
};

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const userRoles = req.nextauth.token?.user?.roles || [];

    // ✅ Match path to role access
    for (const [routePrefix, allowedRoles] of Object.entries(roleAccess)) {
      if (pathname.startsWith(routePrefix)) {
        const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
        if (!hasAccess) {
          const url = new URL("/login", req.url);
          url.searchParams.set("from", pathname);
          return NextResponse.redirect(url);
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // ✅ require authentication for protected routes
      authorized: ({ token, req }) => {
        const isAuthorized = !!token;
        return isAuthorized; // if true: will redirect to "/login"
      },
    },
  }
);

export const config = {
  // ✅ Protected routes
  matcher: ["/admin/:path*", "/client/:path*", "/secretaire/:path*"],
};
