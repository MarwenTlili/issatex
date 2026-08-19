import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { logger } from "./utils/Logger";

/**
 * Decode JWT and retrun it's payload
 *
 * @param token string
 * @returns T | null
 */
export function parseJwt<T = unknown>(token: string): T | null {
  try {
    const base64Url = token.split(".")[1];

    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");

    return JSON.parse(jsonPayload) as T;
  } catch (error) {
    logger("error", "Failed to parse JWT: ", error);
    return null;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a flat or nested object into a URL-encoded query string.
 * * ### Features:
 * - **Primitives:** Converts strings, numbers, and booleans directly to `key=value`.
 * - **Arrays:** appends duplicate keys for array items (`key=item1&key=item2`).
 * - **Nested Objects:** Serializes one level of nested objects using bracket notation (`key[nestedKey]=value`).
 * - **Falsy/Empty Filtering:** Automatically skips `null`, `undefined`, and empty strings `""`.
 *
 * @param params - An object containing key-value pairs to convert into query parameters.
 * @returns A URL-encoded query string (e.g., `"page=1&sort=desc"`).
 *
 * @example
 * ```typescript
 * const params = {
 *    page: 2,
 *    tags: ['typescript', 'js'],
 *    filter: { status: 'active', archived: false },
 *    empty: "",
 *    missing: null
 * };
 * * buildQueryParams(params);
 * // Returns: "page=2&tags=typescript&tags=js&filter%5Bstatus%5D=active&filter%5Barchived%5D=false"
 * // Decoded: "page=2&tags=typescript&tags=js&filter[status]=active&filter[archived]=false"
 * ```
 */
export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  const addParam = (key: string, value: unknown): void => {
    if (value === undefined || value === null || value === "") return;

    if (typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value as Record<string, unknown>).forEach(
        ([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
          }
        },
      );
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null)
          searchParams.append(key, String(item));
      });
    } else {
      searchParams.append(key, String(value));
    }
  };

  Object.entries(params).forEach(([key, value]) => addParam(key, value));
  return searchParams.toString();
}
