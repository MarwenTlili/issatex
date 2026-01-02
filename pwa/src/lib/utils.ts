import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { logger } from "./utils/Logger";

/**
 * Decode JWT and retrun it's payload
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
