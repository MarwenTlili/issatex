import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { JwtPayload } from "@/types/index";
import CredentialsProvider from "next-auth/providers/credentials";

import { User } from "@/types/resources/User";
import { parseJwt } from "@/lib/utils";
import { apiRequest } from "@/lib/api/base";
import { UnauthorizedException } from "@/lib/api/exceptions";
import { authService } from "@/lib/auth/auth-service";
import { AuthErrorFactory } from "@/lib/auth/errors";

import {
  NEXTAUTH_SECRET,
  API_ENDPOINTS,
  API_CONFIG,
  ENTRYPOINT,
} from "@/config/api";
import { logger } from "../utils/Logger";

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const authData = await authService.login(
            credentials?.username ?? "",
            credentials?.password ?? "",
          );
          // logger("info", "authorize", { authData });

          const payload = parseJwt<JwtPayload>(authData.access_token);

          if (!payload) {
            // Treat corrupted or invalid JWT structures as a generic credentials failure
            throw new UnauthorizedException({
              status: 401,
              title: "Invalid Token Payload",
            });
          }

          return {
            id: payload.sub,
            name: payload.username,
            email: payload.email,
            roles: payload.roles,
            image: payload.avatar,
            accessToken: authData.access_token,
            refreshToken: authData.refresh_token,
            expiresAt: Date.now() + authData.expires_in * 1000,
            mercureJwt: authData.mercureJwt,
          };
        } catch (error) {
          throw AuthErrorFactory.from(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user && account) {
        const jwt: JWT = {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: user.expiresAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            image: user.image,
          },
          mercureJwt: user.mercureJwt,
        };
        return jwt;
      }

      // Fetch the latest user data from the API to get updated avatar
      if (trigger === "update") {
        try {
          if (!token?.user?.id) {
            return {
              ...token,
              error: "NoSessionFoundError",
            };
          }

          // const userResponse = usersApiService.getOne(token.user?.id);
          const userResponse = await apiRequest<User>(
            `${ENTRYPOINT}${API_ENDPOINTS.USERS}/${token.user?.id}`,
            {
              token: token.accessToken,
            },
          );

          if (!userResponse) return token;

          // Extract avatar contentUrl if avatar is an object
          let avatarUrl = null;
          if (
            userResponse.avatar &&
            typeof userResponse.avatar === "object" &&
            userResponse.avatar.contentUrl
          ) {
            avatarUrl = userResponse.avatar.contentUrl;
          }

          // Update token with fresh user data
          token.user = {
            ...token.user,
            id: token.user?.id || String(userResponse.id),
            name: userResponse.username || token.user?.name,
            email: userResponse.email || token.user?.email,
            roles: userResponse.roles || token.user?.roles,
            image: avatarUrl || "",
          };
        } catch (error) {
          // Flag the error on the token instead of throwing an unhandled exception
          token.error = "RefreshUserDataError";
          // logger("error", "jwt - trigger", error);
          // throw AuthErrorFactory.from(error);
        }

        return token;
      }

      // Return previous token if the access token has not expired yet
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      // Access token has expired, try to refresh it
      const jwt = await authService.refreshTokens(token);

      return jwt;
    },
    async session({ session, token }) {
      if (token.error) {
        session.error = token.error;
      }

      if (token.user) {
        session.user = token.user || {};
      }

      session.accessToken = token.accessToken;
      session.mercureJwt = token.mercureJwt;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  jwt: {
    maxAge: 60 * 60 * 24, // 1 day
  },
};
