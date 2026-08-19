/**
 * Core HTTP infrastructure and networking utilities.
 * Handles generic CRUD abstractions, dynamic query compilation, token resolution, and automatic timeout handling.
 */

import { getSession } from "next-auth/react";

import { ApiCollection } from "@/types/resources/ApiCollection";
import { buildQueryParams } from "@/lib/utils";
import { ApiErrorFactory } from "@/lib/api/exceptions";
import { logger } from "../utils/Logger";

/**
 * A generic abstraction layer for handling standard RESTful CRUD operations against an API endpoint.
 * Encapsulates common request configuration, formatting, and exception transformation.
 *
 * @template T The domain model or entity type (e.g., `User`, `Product`).
 * @template CreateT The data structure required to create the entity. Defaults to `Partial<T>`.
 * @template UpdateT The data structure required to update the entity. Defaults to `Partial<T>`.
 * @template CollectionT The wrapper structure returned for collection lists. Defaults to `ApiCollection<T>`.
 */
export class ApiService<
  T,
  CreateT = Partial<T>,
  UpdateT = Partial<T>,
  CollectionT = ApiCollection<T>,
> {
  /**
   * @param endpoint The base URL path for the resource (e.g., `/api/users`).
   */
  constructor(private readonly endpoint: string) {}

  /**
   * Generates a fully qualified resource URL for a specific entity ID.
   *
   * @param id The unique identifier of the resource.
   * @returns The combined resource endpoint path.
   */
  private resourceUrl(id: string | number): string {
    return `${this.endpoint}/${id}`;
  }

  /**
   * Dispatches a network request scoped to this service's configuration.
   *
   * @template R The expected response payload shape.
   * @param url The target destination URL string.
   * @param init Optional initialization options matching standard `RequestInit`.
   * @returns A promise resolving to the typed response payload.
   */
  protected request<R>(url: string, init?: RequestInit): Promise<R> {
    return apiRequest<R>(url, init);
  }

  /**
   * Fetches a paginated or filtered collection of resources via a HTTP `GET` request.
   *
   * @param params An object representing key-value pairs to transform into an encoded query string.
   * @returns A promise resolving to the collection payload.
   */
  async getAll(params: Record<string, unknown> = {}): Promise<CollectionT> {
    const queryString = buildQueryParams(params);
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    return this.request<CollectionT>(url);
  }

  /**
   * Fetches a single specific resource by its unique identifier via a HTTP `GET` request.
   * Supports absolute paths or IDs.
   *
   * @param id The resource ID, or a raw IRI string path starting with `/`.
   * @param options Custom standard `RequestInit` fetch configurations.
   * @returns A promise resolving to the individual entity.
   */
  async getOne(id: string | number, options?: RequestInit): Promise<T> {
    const url =
      typeof id === "string" && id.startsWith("/") ? id : this.resourceUrl(id);
    return this.request<T>(url, options);
  }

  /**
   * Submits a payload to generate a new resource via an HTTP `POST` request.
   * Automatically stringifies body contents to JSON format.
   *
   * @param data The payload matching the required target creation type.
   * @returns A promise resolving to the newly created entity.
   */
  async create(data: CreateT): Promise<T> {
    return this.request<T>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Updates an existing resource using an HTTP `PATCH` request.
   * Employs the `application/merge-patch+json` content type standard.
   *
   * @param id The unique identifier of the target resource.
   * @param data The patch payload matching the required update structure.
   * @returns A promise resolving to the updated entity state.
   */
  async update(id: string | number, data: UpdateT): Promise<T> {
    return this.request<T>(this.resourceUrl(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(data),
    });
  }

  /**
   * Removes a resource from the origin server via an HTTP `DELETE` request.
   *
   * @param id The unique identifier of the resource to remove.
   * @returns A promise that resolves cleanly when deletion completes.
   */
  async delete(id: string | number): Promise<void> {
    return this.request<void>(this.resourceUrl(id), { method: "DELETE" });
  }
}

/**
 * Safely parses the body of an HTTP response contextually based on the `Content-Type` header
 * and status signatures. Accounts gracefully for empty data hooks.
 *
 * @param response The raw network Response object yielded by standard fetch.
 * @returns Parsed JSON, fallback text content, or `undefined` if empty/204.
 */
const parseResponse = async (response: Response): Promise<any> => {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (
    contentType.includes("application/json") ||
    contentType.includes("application/ld+json") ||
    contentType.includes("application/problem+json")
  ) {
    return JSON.parse(text);
  }

  return text;
};

/**
 * Automatically evaluates or asynchronously retrieves an active authorization bearer token.
 *
 * @param token An optional, explicitly provided token string overrides NextAuth resolution.
 * @returns A promise resolving to the token value, or `undefined` if no active session exists.
 *
 * @note **Performance Alert**: Invoking `getSession()` on the client side triggers an internal
 * network fetch to the NextAuth handler on every isolated invocation. For high-frequency layouts,
 * consider caching the token contextually or supplying it explicitly via query management tools.
 */
const resolveAccessToken = async (
  token?: string,
): Promise<string | undefined> => {
  if (token) return token;
  return (await getSession())?.accessToken;
};

/**
 * Extends the standard Fetch execution profile to accommodate custom application behaviors.
 */
interface RequestConfig extends RequestInit {
  /** Maximum duration allowed for request completion in milliseconds before triggering an abort. Defaults to 30000ms. */
  timeout?: number;
  /** Explicit authorization override token to prevent NextAuth session parsing cascades. */
  token?: string;
}

/**
 * Orchestrates global application HTTP networking requests.
 * Manages default JSON-LD headers, contextual authorization attachment, timeout handling,
 * and routes low-level failures directly into standardized domain error types.
 *
 * @template T The expected structured response output data scheme.
 * @param endpoint The absolute or relative target request URL string.
 * @param options Custom network configuration overrides including timeouts and custom explicit tokens.
 * @returns A promise resolving to the cleanly mapped generic object representation `T`.
 * @throws {ApiException} Re-throws specific API errors transformed using `ApiErrorFactory`.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestConfig = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/ld+json");
  }

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/ld+json");
  }

  if (!headers.has("Authorization")) {
    const token = await resolveAccessToken(options.token);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetchWithTimeout(endpoint, { ...options, headers });
    const body = await parseResponse(response);
    // logger("info", "apiRequest", { body });

    if (!response.ok) {
      throw ApiErrorFactory.fromResponse(response, body);
    }

    return body as T;
  } catch (error: unknown) {
    throw ApiErrorFactory.fromError(error);
  }
}

/**
 * Employs an `AbortController` mechanism to fetch data while enforcing a strict timing window.
 *
 * @param url The targeted resource network endpoint.
 * @param options Configurations matching standard extended `RequestConfig` paradigms.
 * @returns Resolves directly to the engine's network `Response`.
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestConfig = {},
): Promise<Response> => {
  const { timeout = 30000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};
