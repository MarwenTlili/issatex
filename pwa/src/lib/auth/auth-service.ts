import { JWT } from "next-auth/jwt";

import { JwtAuthData } from "@/types";
import { apiRequest } from "@/lib/api/base";
import { RegistrationFormData } from "@/lib/validation/schemas";
import { RegisterClient } from "@/types/resources/RegisterClient";

import { API_ENDPOINTS, AUTH_URL, TOKEN_REFRESH_URL } from "@/config/api";

import { logger } from "@/lib/utils/Logger";

/**
 * Service responsible for authentication and identity-related network requests.
 * Encapsulates operations for credential verification, token lifecycle management,
 * and external user/client onboarding.
 */
export class AuthService {
  /**
   * Authenticates internal domain users (e.g., Admin, Secretary, Stock Keeper) against the API.
   *
   * @param username - The unique account username or identifier.
   * @param password - The raw user authentication credentials.
   * @returns A promise that resolves to the JWT authentication payload including access and refresh tokens.
   * @throws {ApiException} Re-throws specific API network exceptions if credentials or payload validation fails.
   */
  async login(username: string, password: string): Promise<JwtAuthData> {
    const response = await apiRequest<JwtAuthData>(AUTH_URL, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    // logger("info", "AuthService.login", response);
    return response;
  }

  /**
   * Refreshes an expired JWT access token using the active refresh token token payload.
   *
   * @remarks
   * Designed to be consumed primarily within NextAuth's `jwt` callback lifecycle.
   * Ensures seamless token rotation while returning a flagged `JWT` object containing
   * an `error` key if the refresh stream fails or returns invalid payloads.
   *
   * @param token - The active NextAuth JWT token object containing existing credentials.
   * @returns A promise resolving to an updated `JWT` payload with new expiry times or a fallback error state.
   */
  async refreshTokens(token: JWT): Promise<JWT> {
    try {
      const refreshedTokens = await apiRequest<JwtAuthData>(TOKEN_REFRESH_URL, {
        method: "POST",
        body: JSON.stringify({
          refresh_token: token.refreshToken,
        }),
      });
      // logger("info", "AuthService.refreshTokens", refreshedTokens);

      if (!refreshedTokens) {
        return {
          ...token,
          error: "RefreshTokenError",
        };
      }

      return {
        ...token,
        accessToken: refreshedTokens.access_token,
        refreshToken: refreshedTokens.refresh_token ?? token.refresh_token,
        expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
        error: undefined,
      };
    } catch (error) {
      return {
        ...token,
        error: "RefreshTokenError",
      };
    }
  }

  /**
   * Submits a public client onboarding registration payload.
   *
   * @param data - The validated registration form entries adhering to the `RegistrationFormData` schema.
   * @returns A promise resolving to the created client resource representation.
   * @throws {ApiException} Re-throws specific API exceptions if registration constraints fail.
   */
  async registerClient(data: RegistrationFormData): Promise<RegisterClient> {
    return apiRequest<RegisterClient>(API_ENDPOINTS.REGISTER_CLIENT, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

/**
 * Singleton instance of `AuthService` exported for convenient cross-layer reuse.
 */
export const authService = new AuthService();
