import { toast } from "sonner";

export interface ApiError {
  title?: string;
  detail?: string;
  status?: number;
  type?: string;
  violations?: ApiViolation[];
  networkError?: boolean;
}

export interface ApiViolation {
  propertyPath: string;
  message: string;
  code?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export function isApiError(err: any): err is ApiError {
  return (
    err && typeof err === "object" && ("status" in err || "networkError" in err)
  );
}

export function isValidationError(err: ApiError): boolean {
  return err.status === 422 && Array.isArray(err.violations);
}

export function extractFormErrors(err: ApiError): FormErrors {
  if (!isValidationError(err)) {
    return {};
  }

  const formErrors: FormErrors = {};
  err.violations?.forEach((violation) => {
    if (violation.propertyPath && violation.message) {
      formErrors[violation.propertyPath] = violation.message;
    }
  });

  return formErrors;
}

const errorMessages: Record<number, { title: string; description?: string }> = {
  400: {
    title: "Requête invalide",
    description: "Les données envoyées sont incorrectes.",
  },
  401: {
    title: "Session expirée",
    description: "Veuillez vous reconnecter.",
  },
  403: {
    title: "Accès refusé",
    description: "Vous n'avez pas les permissions nécessaires.",
  },
  404: {
    title: "Ressource introuvable",
    description: "L'élément demandé n'existe pas.",
  },
  409: {
    title: "Conflit de données",
    description: "Une ressource similaire existe déjà.",
  },
  415: {
    title: "Format non supporté",
    description: "Le format des données envoyées n'est pas valide.",
  },
  422: {
    title: "Données invalides",
    description: "Veuillez corriger les erreurs dans le formulaire.",
  },
  429: {
    title: "Trop de requêtes",
    description: "Veuillez patienter avant de réessayer.",
  },
  500: {
    title: "Erreur serveur",
    description: "Un problème technique est survenu. Réessayez plus tard.",
  },
  502: {
    title: "Service indisponible",
    description: "Le serveur est temporairement indisponible.",
  },
  503: {
    title: "Service en maintenance",
    description: "Le service est temporairement en maintenance.",
  },
};

export function handleApiError(
  err: ApiError,
  options?: {
    showToast?: boolean;
    customMessage?: string;
  },
): FormErrors {
  const { showToast = true, customMessage } = options || {};

  // Extract form errors for validation errors
  const formErrors = extractFormErrors(err);

  // Don't show toast for validation errors - they should be handled in forms
  if (isValidationError(err)) {
    if (showToast) {
      toast.error("Erreurs de validation", {
        description: "Veuillez corriger les erreurs dans le formulaire.",
      });
    }
    return formErrors;
  }

  // Network-level errors
  if (err.networkError) {
    if (showToast) {
      toast.error("Problème de connexion", {
        description: "Vérifiez votre connexion internet et réessayez.",
      });
    }
    return formErrors;
  }

  // Server errors (5xx)
  if (err.status && err.status >= 500) {
    if (showToast) {
      const message = errorMessages[err.status] || errorMessages[500];
      toast.error(message.title, {
        description: customMessage || message.description,
      });
    }
    return formErrors;
  }

  // Client errors (4xx)
  if (err.status && err.status >= 400 && err.status < 500) {
    if (showToast) {
      const message = errorMessages[err.status];
      if (message) {
        toast.error(message.title, {
          description: customMessage || message.description,
        });
      } else {
        toast.error(err.title || "Erreur", {
          description:
            customMessage || err.detail || "Une erreur est survenue.",
        });
      }
    }
    return formErrors;
  }

  // Unknown errors
  if (showToast) {
    toast.error(err.title || "Erreur inconnue", {
      description:
        customMessage || err.detail || "Une erreur inattendue est survenue.",
    });
  }

  return formErrors;
}

export function getErrorMessage(err: ApiError): string {
  if (err.networkError) {
    return "Problème de connexion internet";
  }

  if (err.status && errorMessages[err.status]) {
    return errorMessages[err.status].title;
  }

  return err.title || err.detail || "Une erreur est survenue";
}

export function shouldRetry(err: ApiError): boolean {
  // Retry on network errors
  if (err.networkError) {
    return true;
  }

  // Retry on server errors (5xx) but not client errors (4xx)
  if (err.status && err.status >= 500) {
    return true;
  }

  // Retry on specific client errors that might be temporary
  if (err.status === 429) {
    // Too Many Requests
    return true;
  }

  return false;
}
