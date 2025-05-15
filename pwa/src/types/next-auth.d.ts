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
    expiresAt?: number; // (ms) = now (ms) + expires_in (sec) * 1000
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
