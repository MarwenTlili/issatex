import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { apiFetch, refreshTokens } from "./auth-functions";
import type { JWT } from "next-auth/jwt";
import type { JwtAuthData, JwtPayload } from "@/types/index";

import { parseJwt } from "@/lib/utils";
import {
  AUTH_URL,
  NEXTAUTH_SECRET,
  API_ENDPOINTS,
  ENTRYPOINT,
} from "@/config/api";
import { User } from "@/types/resources/User";
import { isApiError } from "../api/handle-api-error";
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
          const authData = await apiFetch<JwtAuthData>(
            AUTH_URL,
            "POST",
            undefined,
            {
              username: credentials?.username,
              password: credentials?.password,
            },
          );

          if (!authData) return null;

          // Use access_token's payload to check for access token expiration
          const payload = parseJwt<JwtPayload>(authData.access_token);

          if (!payload) return null;

          const user: NextAuthUser = {
            id: payload.sub,
            name: payload.username,
            email: payload.email,
            roles: payload.roles,
            image: payload.avatar,
            accessToken: authData.access_token,
            refreshToken: authData.refresh_token,
            // store expires_in in user's object as timestamp (ms) after calculation
            expiresAt: Date.now() + authData.expires_in * 1000, // ms
            mercureJwt: authData.mercureJwt,
          };

          /** Return a user object that will be stored in the JWT */
          return user;
        } catch (error) {
          if (
            isApiError(error) &&
            error.status === 403 &&
            error.detail === "AccountDisabled"
          ) {
            throw new Error("AccountDisabled");
          }
          return null;
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
          // we are on server-side that's why using ENTRYPOINT instead of API_CONFIG.BASE_URL
          const userResponse = await apiFetch<User>(
            `${ENTRYPOINT}${API_ENDPOINTS.USERS}/${token.user?.id}`,
            "GET",
            token.accessToken,
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
          logger("error", "Failed to fetch user data during session update", {
            error,
          });
        }

        return token;
      }

      // Return previous token if the access token has not expired yet
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      // Access token has expired, try to refresh it
      const jwt = await refreshTokens(token);

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
