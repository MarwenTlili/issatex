import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import {
  ApiException,
  NetworkException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  ServerException,
  ValidationException,
} from "@/lib/api/exceptions";

/**
 * A mapped record grouping field names with their respective localized validation error messages.
 */
export type FormErrors = Record<string, string>;

// ============================================================================
/**
 * Global UI/UX error handling utility for API interactions.
 *
 * Inspects incoming errors against application-specific HTTP infrastructure exceptions,
 * normalizes them into human-readable titles/messages, and triggers a user-facing
 * toast notification using `sonner`.
 *
 * @example
 * ```ts
 * // Within a React Query mutation onError handler:
 * onError: (error) => {
 *   handleApiError(error, "Impossible de sauvegarder les modifications.");
 * }
 * ```
 *
 * @param error The caught anomaly, typically an instance of {@link ApiException}, {@link NetworkException}, a native JS {@link Error}, or an unknown structural object.
 * @param customMessage An optional contextual fallback message to display if the error doesn't expose a detailed message.
 */
export function handleApiError(error: unknown, customMessage?: string): void {
  if (error instanceof ValidationException) return;
  const errorPresentation = mapError(error, customMessage);
  toast.error(errorPresentation.title, {
    description: errorPresentation.message,
    style: { whiteSpace: "pre-line" },
    duration: Infinity,
  });
}

// ============================================================================
/**
 * Defines a structural schema for presenting normalized error strings to end-users.
 */
interface ErrorPresentation {
  /** The high-level summary header for the presentation layer. */
  title: string;
  /** Supporting text providing granular context about the failure or corrective steps. */
  message?: string;
}

/**
 * Maps catch-block exceptions to presentation-friendly display strings.
 * Transcribes internal codes and exceptions into user-facing French copy.
 *
 * @param error The caught error instance.
 * @param defaultMessage The standard message fallback if specific API details are absent.
 * @returns An object formatted strictly for consumer UI components.
 * @internal
 */
export function mapError(
  error: unknown,
  defaultMessage = "Une erreur est survenue.",
): ErrorPresentation {
  if (error instanceof UnauthorizedException) {
    return {
      title: "Authentification requise",
      message: "Veuillez vous connecter pour continuer.",
    };
  }

  if (error instanceof ForbiddenException) {
    return {
      title: "Accès refusé",
      message: "Vous n'avez pas l'autorisation d'effectuer cette action.",
    };
  }

  if (error instanceof NotFoundException) {
    return {
      title: "Introuvable",
      message: "La ressource demandée est introuvable.",
    };
  }

  if (error instanceof ConflictException) {
    return {
      title: "Conflit",
      message:
        error.detail ??
        "Cette opération est en conflit avec l'état actuel de la ressource.",
    };
  }

  if (error instanceof NetworkException) {
    return {
      title: "Connexion impossible",
      message:
        "Impossible de contacter le serveur. Vérifiez votre connexion Internet.",
    };
  }

  if (error instanceof ServerException) {
    return {
      title: "Erreur du serveur",
      message:
        "Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.",
    };
  }

  if (error instanceof ApiException) {
    return { title: "Erreur", message: error.detail ?? defaultMessage };
  }

  if (error instanceof Error) {
    return { title: "Erreur", message: error.message || defaultMessage };
  }

  return { title: "Erreur", message: defaultMessage };
}

// ============================================================================
/**
 * High-level form error handler that orchestrates form field validation and global API error presentation.
 *
 * First attempts to map backend validation errors (`422 Unprocessable Entity`) directly to React Hook Form
 * field states using the provided `setError` handler. If the error is not a validation exception (e.g., `401 Unauthorized`,
 * `500 Internal Server Error`, or `NetworkException`), it delegates to {@link handleApiError} to display a global toast notification.
 *
 * @template T - The shape of the form values, inferred from the `useForm` context.
 *
 * @param error - The caught exception or error instance from an async action or mutation block.
 * @param setError - The `setError` function returned by React Hook Form's `useForm` hook.
 * @param customMessage - An optional fallback message to display in the global toast if a non-validation error lacks detailed context.
 *
 * @see {@link handleApiError}
 * @see {@link ValidationException}
 *
 * @example
 * ```tsx
 * const { handleSubmit, setError } = useForm<RegistrationFormData>();
 *
 * const onSubmit = async (data: RegistrationFormData) => {
 *   try {
 *     await registerUser(data);
 *   } catch (error) {
 *     handleFormSubmitError(error, setError, "Échec de l'inscription.");
 *   }
 * };
 * ```
 */
export function handleFormSubmitError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  customMessage?: string,
): void {
  // 1. Check if the error is specifically a ValidationException (usually from the backend)
  if (error instanceof ValidationException && error.hasValidationErrors) {
    // 2. Loop through each validation error returned by the server
    error.validationErrors.forEach((violation, index) => {
      // 3. Map the server's field path to the React Hook Form field and set the error state
      setError(
        violation.propertyPath as Path<T>,
        {
          type: "server",
          message: violation.message,
        },
        {
          // 4. Automatically focus the input field, but only for the very first error in the list
          shouldFocus: index === 0,
        },
      );
    });
    // 5. Exit early so we don't pass validation errors to the global error handler
    return;
  }

  // If it's not a validation error (e.g., 401, 500, NetworkError), show global toast
  handleApiError(error, customMessage);
}
