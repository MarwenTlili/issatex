import { getSession } from "next-auth/react";
import { ENTRYPOINT } from "@/config/entrypoint";

/**
 * Represents an HTTP error returned by the API.
 *
 * Extends the native `Error` object to include HTTP status code and status text.
 */
export class ApiError extends Error {
  /**
   * Creates a new ApiError instance.
   *
   * @param {number} status - The HTTP status code.
   * @param {string} statusText - The HTTP status text.
   * @param {string} [message] - Optional custom error message.
   */
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Performs a `fetch` request with JWT-based authentication.
 *
 * Retrieves the session using `getSession` and attaches the `Authorization` header
 * with a Bearer token. If no session or access token is found, it throws an `ApiError`.
 *
 * @async
 * @param {string} url - The URL to request.
 * @param {RequestInit} [options={}] - Additional fetch options.
 * @throws {ApiError} If the user is unauthorized or the response is not OK.
 * @returns {Promise<Response>} The fetch API `Response` object.
 *
 * @example
 * const response = await fetchWithAuth("/api/users");
 * const data = await response.json();
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new ApiError(401, "Unauthorized", "No valid session found");
  }

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return response;
}

/**
 * Sends an authenticated request to the API and parses the JSON response.
 *
 * Uses `fetchWithAuth` to ensure a valid session and JWT token.
 * If the response status is `204 No Content`, returns `undefined`.
 *
 * @async
 * @template T - The expected type of the JSON response body.
 * @param {string} endpoint - API endpoint (relative to `ENTRYPOINT`).
 * @param {RequestInit} [options={}] - Additional fetch options.
 * @throws {ApiError} If the request fails or the response is not OK.
 * @returns {Promise<T>} Parsed JSON data from the response.
 *
 * @example
 * interface User { id: number; name: string; }
 * const users = await apiRequest<User[]>("/users");
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(`${ENTRYPOINT}${endpoint}`, options);

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

/**
 * Builds a URL query string from a given parameters object.
 *
 * This function takes an object of key-value pairs and converts it into a URL-encoded query string.
 * - Skips parameters that are `undefined`, `null`, or an empty string.
 * - Converts all values to strings before appending them.
 * - Handles nested objects by generating keys in the form `parent[child]`.
 * - Arrays are appended as repeated keys (default `URLSearchParams` behavior).
 *
 * @param {Record<string, any>} params - The object containing query parameters.
 * @returns {string} The encoded query string, without the leading `?`.
 * @example
 * buildQueryParams({ order: { createdAt: "desc" } });
 * // "order[createdAt]=desc"
 */
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object" && !Array.isArray(value)) {
        // Handle nested objects like order parameters
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
          }
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}
