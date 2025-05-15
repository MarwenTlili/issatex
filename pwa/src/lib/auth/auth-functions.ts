import { JWT } from "next-auth/jwt";

import { TOKEN_REFRESH_URL } from "@/config/entrypoint";
import { JwtAuthData } from "@/types/index";
import { logger } from "@/lib/utils/Logger";

/**
 * Fetch url with JWT Token bearer
 * @param url string
 * @param method "GET" | "POST"
 * @param token string | undefined
 * @param body Record<string, any> | undefined
 * @returns Promise<T | null>
 * @example
 *  const data = await apiFetch<T>( URL, METHOD );
 * @example
 *  const data = await apiFetch<T>(
 *    URL, METHOD, TOKEN
 *  );
 * @example
 *  const data = await apiFetch<T>(
 *    URL, "POST", TOKEN, { "key": "value" }
 *  );
 */
export async function apiFetch<T>(
  url: string,
  method: "GET" | "POST",
  token?: string,
  body?: Record<string, any>
): Promise<T | null> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      logger("error", "apiFetch failed", {
        method,
        url,
        message: errorResponse.message || `HTTP ${response.status}`,
      });
      return null;
    }

    return response.json();
  } catch (error) {
    logger("error", "apiFetch failed", { method, url });
    return null;
  }
}

/**
 * Refresh access token
 * @param token JWT
 * @returns Promise<JWT>
 */
export async function refreshTokens(token: JWT): Promise<JWT> {
  try {
    const refreshedTokens = await apiFetch<JwtAuthData>(
      TOKEN_REFRESH_URL,
      "POST",
      undefined,
      {
        refresh_token: token.refreshToken,
      }
    );

    if (!refreshedTokens) {
      return {
        ...token,
        error: "RefreshTokenError",
      };
    }

    logger("info", "Access token refreshed.");
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refresh_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      error: undefined,
    };
  } catch (error) {
    logger("error", "RefreshTokenError", { error });
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}
