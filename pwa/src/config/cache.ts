// Query Keys for React Query
export const QUERY_KEYS = {
  ARTICLES: "articles",
  ARTICLE: "article",
  CLIENTS: "clients",
  CLIENT: "client",
  CURRENT_CLIENT: "current-client",
  ORDRE_FABRICATIONS: "ordre-fabrications",
  ORDRE_FABRICATION: "ordre-fabrication",
  TAILLES_ORDRE_FABRICATION: "tailles-ordre-fabrication",
  PLANNINGS: "plannings",
  PLANNING: "planning",
  PRODUCTIONS: "productions",
  PRODUCTION: "production",
  PRESENCES: "presences",
  PRESENCE: "presence",
  EMPLOYES: "employes",
  EMPLOYE: "employe",
  ILOTS: "ilots",
  ILOT: "ilot",
  USERS: "users",
  USER: "user",
  CURRENT_USER: "current-user",
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY_DELAY: 1000,
} as const;
