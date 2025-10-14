export interface JwtError {
  code?: number;
  message?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  email?: string;
  roles?: string[];
  image?: string;
}

export interface JwtPayload {
  // [key: string]: any;
  iss?: string;
  sub: string;
  aud?: string | string[];
  exp: number;
  nbf?: number;
  iat: number;
  jti?: string;
  username?: string;
  email?: string;
  roles?: string[];
  avatar?: string;
}

/** Define proper types for JwtAuthData (data structure of the JWT Auth response) */
export interface JwtAuthData {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  token_type: string;
  mercureJwt?: string;
}
