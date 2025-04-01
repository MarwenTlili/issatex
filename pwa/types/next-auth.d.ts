import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      roles?: string[];
      image?: string;
    };
    expires: ISODateString;
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    name?: string;
    email?: string;
    roles?: string[];
    image?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number; // now + expires_in
    // accessTokenExpires?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
    user?: {
      id: string;
      name?: string;
      email?: string;
      roles?: string[];
      image?: string;
    };
  }
}

/** next-auth/src/core/types.ts */
// export interface DefaultSession {
//   user?: {
//     name?: string | null
//     email?: string | null
//     image?: string | null
//   }
//   expires: ISODateString
// }

// export interface DefaultUser {
//   id: string;
//   name?: string;
//   email?: string;
//   image?: string;
// }

// export interface User extends DefaultUser {}

/** next-auth/src/jwt/types.ts */
// export interface DefaultJWT extends Record<string, unknown> {
//   name?: string | null
//   email?: string | null
//   picture?: string | null
//   sub?: string
// }

// export interface JWT extends Record<string, unknown>, DefaultJWT {}
