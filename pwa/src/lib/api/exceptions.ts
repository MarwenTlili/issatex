import { logger } from "@/lib/utils/Logger";

/**
 * Represents a specific validation constraint failure from the API backend.
 * Typically conforms to Symfony / API Platform validation formats.
 */
interface ConstraintViolation {
  propertyPath: string;
  message: string;
  code?: string;
}

/**
 * Structure of an error response conforming to the RFC 7807 Problem Details specification.
 * Used extensively by API Platform.
 *
 * @see {@link https://tools.ietf.org/html/rfc7807}
 */
interface ApiProblemDetails {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;

  // RFC 7807
  type?: string;
  title?: string;
  status: number;
  detail?: string;

  // 422 Validation
  violations?: ConstraintViolation[];
}

/**
 * Base exception for all strongly-typed HTTP errors returned by the API.
 *
 * @extends Error
 */
export class ApiException extends Error {
  readonly type?: string;
  readonly title?: string;
  readonly status: number;
  readonly detail?: string;
  readonly violations?: ConstraintViolation[];

  /**
   * @param problem The parsed RFC 7807 problem details object from the response body.
   */
  constructor(problem: ApiProblemDetails) {
    super(problem.detail ?? problem.title ?? `HTTP ${problem.status}`);

    this.name = this.constructor.name;

    this.type = problem.type;
    this.title = problem.title;
    this.status = problem.status;
    this.detail = problem.detail;
    this.violations = problem.violations;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception thrown when the server cannot or will not process the request due to something
 * that is perceived to be a client error.
 *
 * @status 400 Bad Request
 */
export class BadRequestException extends ApiException {}

/**
 * Exception thrown when authentication is required and has failed or has not yet been provided.
 *
 * @status 401 Unauthorized
 */
export class UnauthorizedException extends ApiException {}

/**
 * Exception thrown when the user has valid credentials but lacks the necessary permissions
 * to access the resource.
 *
 * @status 403 Forbidden
 */
export class ForbiddenException extends ApiException {}

/**
 * Exception thrown when the requested resource could not be found but may be available in the future.
 *
 * @status 404 Not Found
 */
export class NotFoundException extends ApiException {}

/**
 * Exception thrown when a request conflicts with the current state of the server (e.g., duplicate unique keys).
 *
 * @status 409 Conflict
 */
export class ConflictException extends ApiException {}

/**
 * Exception thrown when the server understands the content type of the request entity,
 * but was unable to process the contained instructions (usually due to payload validation errors).
 *
 * @status 422 Unprocessable Entity
 */
export class ValidationException extends ApiException {
  /**
   * Retrieves the array of validation constraint violations.
   *
   * @returns An array of constraint violations, defaulting to an empty array if none exist.
   */
  get validationErrors(): ConstraintViolation[] {
    return this.violations ?? [];
  }

  /**
   * Helper flag to quickly check if any validation errors are attached to this exception.
   */
  get hasValidationErrors(): boolean {
    return this.validationErrors.length > 0;
  }
}

/**
 * Generic fallback exception thrown when the server encounters an unexpected condition
 * that prevented it from fulfilling the request.
 *
 * @status 5xx Internal Server Error
 */
export class ServerException extends ApiException {}

/**
 * Exception thrown when a low-level network failure occurs prior to receiving an HTTP response
 * status code (e.g., DNS lookup failure, CORS restriction, or being offline).
 *
 * @extends Error
 */
export class NetworkException extends Error {
  readonly cause?: unknown;

  /**
   * @param message A descriptive error message. Defaults to "Network error".
   * @param cause The underlying error that precipitated the network failure.
   */
  constructor(message = "Network error", cause?: unknown) {
    super(message);

    this.name = this.constructor.name;
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception thrown specifically when an ongoing HTTP request times out or is explicitly aborted by a client timeout window.
 *
 * @extends NetworkException
 */
export class TimeoutException extends NetworkException {
  constructor(cause?: unknown) {
    super("Request timeout", cause);
  }
}

// ============================================================================
// Registry Pattern
// ============================================================================
type ApiExceptionConstructor = new (problem: ApiProblemDetails) => ApiException;

const exceptionRegistry = new Map<number, ApiExceptionConstructor>([
  [400, BadRequestException],
  [401, UnauthorizedException],
  [403, ForbiddenException],
  [404, NotFoundException],
  [409, ConflictException],
  [422, ValidationException],
]);

// ============================================================================
// Factory Pattern
// ============================================================================
/**
 * Factory responsible for translating raw HTTP responses and low-level JavaScript execution errors
 * into strongly-typed, domain-specific application exceptions.
 *
 * This component acts as an infrastructure/network layer adapter, parsing standardized backends
 * (specifically conforming to the **RFC 7807 Problem Details** specification, such as API Platform)
 * and supplying contextual error payloads to user interface elements or state managers.
 *
 * @class ApiErrorFactory
 */
export class ApiErrorFactory {
  /**
   * Converts a raw HTTP `Response` object and optional body content into a strongly-typed domain `ApiException`.
   * Maps specific HTTP status codes to specialized exception subclasses using an internal registry.
   *
   * @param response The standard Fetch API Response object received from the network request.
   * @param body The parsed or partially parsed JSON body containing RFC 7807 problem details.
   * @returns A concrete instance of an `ApiException` matching the status code or error scope.
   */
  static fromResponse(
    response: Response,
    body?: Partial<ApiProblemDetails>,
  ): ApiException {
    // Fall back to response details if body didn't provide them
    const problem: ApiProblemDetails = {
      type: body?.type ?? "about:blank", // RFC 7807 Compliance
      title: body?.title ?? response.statusText,
      status: response.status,
      detail:
        body?.detail ?? `HTTP Request failed with status ${response.status}`,
      violations: body?.violations ?? [],
    };

    // Determine target class (Registry -> 5xx Fallback -> Base API Exception)
    const ExceptionClass =
      exceptionRegistry.get(response.status) ??
      (response.status >= 500 ? ServerException : ApiException);

    return new ExceptionClass(problem);
  }

  /**
   * Converts caught runtime exceptions, execution bugs, or low-level environment errors
   * into standardized application `Error` or `NetworkException` objects.
   *
   * Safe to pass any caught block data (`unknown`).
   *
   * @param error An unknown error caught during an operation (e.g., within a try/catch block).
   * @returns A predictable, standardized `Error` object instance.
   */
  static fromError(error: unknown): Error {
    logger("error", "ApiErrorFactory.fromError", { error });

    // 1. Pass through existing domain-specific exceptions
    if (error instanceof ApiException || error instanceof NetworkException) {
      return error;
    }

    // 2. Timeout generated by AbortController
    if (error instanceof DOMException && error.name === "AbortError") {
      return new TimeoutException(error);
    }

    // 3. Handle known structural JS error types
    if (error instanceof Error) {
      // Browser fetch failure: offline, DNS, CORS, refused connection...
      if (error instanceof TypeError) {
        return new NetworkException(error.message, error);
      }

      // Standard fallback for unexpected/runtime JS bugs (don't hide them)
      return error;
    }

    // 4. Fallback for completely non-standard throws (strings, objects, null)
    return new Error("Unknown error", { cause: error });
  }
}
