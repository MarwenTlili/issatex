import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const roleAccess: Record<string, string[]> = {
  "/admin": ["ROLE_ADMIN"],
  "/client": ["ROLE_CLIENT"],
  "/secretaire": ["ROLE_SECRETARY"],
};

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const userRoles = req.nextauth.token?.user?.roles || [];

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

    // Continue routing normally
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Reject if token is missing or contains any token error
        if (
          !token ||
          token.error === "RefreshTokenError" ||
          token.error === "NoSessionFoundError"
        ) {
          return false;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/secretaire/:path*"],
};
