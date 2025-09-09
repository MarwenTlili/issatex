export const ENTRYPOINT =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_ENTRYPOINT // http://php
    : process.env.NEXT_PUBLIC_API_URL; // https://localhost

// "development" | "production" | "test"
export const NODE_ENV = process.env.NODE_ENV;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const API_PREFIX = "api";
export const AUTH_URL = `${ENTRYPOINT}/${API_PREFIX}/token/login`;
export const TOKEN_REFRESH_URL = `${ENTRYPOINT}/${API_PREFIX}/token/refresh`;
export const TOKEN_INVALIDATE_URL = `${ENTRYPOINT}/${API_PREFIX}/token/invalidate`;
export const FETCH_PROFILE_URL = `${ENTRYPOINT}/${API_PREFIX}/profile`;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://localhost",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  ARTICLES: "/api/articles",
  CLIENTS: "/api/clients",
  ORDRE_FABRICATIONS: "/api/ordre_fabrications",
  TAILLE_ORDRE_FABRICATIONS: "/api/taille_ordre_fabrications",
  PLANNINGS: "/api/plannings",
  PRODUCTIONS: "/api/productions",
  ILOTS: "/api/ilots",
  USERS: "/api/users",
  AVATARS: "/api/avatars",
  HEALTH: "/api/health",
} as const;
