export const ENTRYPOINT =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_ENTRYPOINT // http://php
    : process.env.NEXT_PUBLIC_API_URL; // https://localhost

// "development" | "production" | "test"
export const NODE_ENV = process.env.NODE_ENV;

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export const OPEN_API_DOC = "/docs.jsonopenapi";

export const HYDRA_DOC = "/docs.jsonld";

export const API_PREFIX = "api";

export const AUTH_URL = `${ENTRYPOINT}/${API_PREFIX}/token/login`;

export const TOKEN_REFRESH_URL = `${ENTRYPOINT}/${API_PREFIX}/token/refresh`;

export const TOKEN_INVALIDATE_URL = `${ENTRYPOINT}/${API_PREFIX}/token/invalidate`;

export const FETCH_PROFILE_URL = `${ENTRYPOINT}/${API_PREFIX}/profile`;
