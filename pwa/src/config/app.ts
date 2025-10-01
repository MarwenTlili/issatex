// Application Routes
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CLIENT: {
    DASHBOARD: "/client",
    ARTICLES: "/client/articles",
    ARTICLE_NEW: "/client/articles/new",
    ARTICLE_DETAIL: (id: number) => `/client/articles/${id}`,
    ARTICLE_EDIT: (id: number) => `/client/articles/${id}/edit`,
    ORDRE_FABRICATIONS: "/client/ordre-fabrications",
    ORDRE_FABRICATION_NEW: "/client/ordre-fabrications/new",
    ORDRE_FABRICATION_DETAIL: (id: string) =>
      `/client/ordre-fabrications/${id}`,
    ORDRE_FABRICATION_EDIT: (id: string) =>
      `/client/ordre-fabrications/${id}/edit`,
    SETTINGS: `/client/parametres`
  },
  ADMIN: {
    DASHBOARD: "/admin",
  },
  SECRETAIRE: {
    DASHBOARD: "/secretaire",
    PRODUCTIONS: "/secretaire/productions",
    PRESENCES: "/secretaire/presences",
    PRESENCE_NEW: "/secretaire/presences/new",
    PRESENCE_DETAIL: (id: number) => `/secretaire/presences/${id}`,
    PRESENCE_EDIT: (id: number) => `/secretaire/presences/${id}/edit`,
    SETTINGS: "/secretaire/parametres",
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// User Messages
export const MESSAGES = {
  SUCCESS: {
    ARTICLE_CREATED: "Article créé avec succès",
    ARTICLE_UPDATED: "Article mis à jour avec succès",
    ARTICLE_DELETED: "Article supprimé avec succès",
    ORDRE_FABRICATION_CREATED: "Ordre de fabrication créé avec succès",
    ORDRE_FABRICATION_UPDATED: "Ordre de fabrication mis à jour avec succès",
    ORDRE_FABRICATION_DELETED: "Ordre de fabrication supprimé avec succès",
    PRODUCTION_CREATED: "Production créée avec succès",
    PRODUCTION_UPDATED: "Production mise à jour avec succès",
    PRODUCTION_DELETED: "Production supprimée avec succès",
  },
  DIALOG: {
    ARTICLE_DELETE: "Êtes-vous sûr de vouloir supprimer cet article ?",
    ORDRE_FABRICATION_DELETE:
      "Êtes-vous sûr de vouloir supprimer cet ordre de fabrication ?",
  },
  ACTION: {
    DELETE: "Supprimer",
    UPDATE: "Mis à jour",
  },
  ERROR: {
    GENERIC: "Une erreur est survenue",
    NETWORK: "Erreur de connexion réseau",
    UNAUTHORIZED: "Accès non autorisé",
    FORBIDDEN: "Accès interdit",
    NOT_FOUND: "Ressource non trouvée",
    VALIDATION: "Erreur de validation",
    CLIENT_FETCH_ERROR: "Impossible de récupérer les informations client",
    ARTICLE_FETCH_ERROR: "Impossible de récupérer l'article",
    ORDRE_FABRICATION_FETCH_ERROR:
      "Impossible de récupérer l'ordre de fabrication",
    ORDRES_FABRICATION_FETCH_ERROR: "Aucune ordre de fabrication",
  },
  LOADING: {
    ARTICLES: "Chargement des articles ...",
    ARTICLE: "Chargement de l'article ...",
    ORDRE_FABRICATIONS: "Chargement des ordres de fabrication ...",
    ORDRE_FABRICATION: "Chargement de l'ordre de fabrication ...",
    DASHBOARD: "Chargement du tableau de bord ...",
    SAVING: "Enregistrement ...",
    DELETING: "Suppression ...",
  },
} as const;

// Form Validation
export const VALIDATION = {
  MIN_LENGTH: {
    USERNAME: 3,
    PASSWORD: 6,
    DESIGNATION: 2,
    COMPOSITION: 10,
    REF: 2,
  },
  MAX_LENGTH: {
    USERNAME: 50,
    EMAIL: 100,
    DESIGNATION: 255,
    REF: 50,
    COMPOSITION: 1000,
  },
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    REF: /^[A-Z0-9-_]+$/i,
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  INPUT: "yyyy-MM-dd",
  DATETIME: "dd/MM/yyyy HH:mm",
  TIME: "HH:mm",
} as const;

// Status Colors
export const STATUS_COLORS = {
  Cree: "bg-blue-100 text-blue-800",
  En_cours: "bg-yellow-100 text-yellow-800",
  Terminee: "bg-green-100 text-green-800",
  Annule: "bg-red-100 text-red-800",
  Planifiee: "bg-purple-100 text-purple-800",
  En_Attente: "bg-gray-100 text-gray-800",
} as const;
