import { getSession } from "next-auth/react";
import { ApiCollection } from "@/types/resources/ApiCollection";
import { ENTRYPOINT } from "@/config/api";

/**
 * Request configuration interface
 */
interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Creates a fetch request with timeout support
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestConfig = {}
): Promise<Response> => {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
};

/**
 * Performs a fetch request with JWT-based authentication and enhanced error handling
 */
export async function fetchWithAuth(
  url: string,
  options: RequestConfig = {}
): Promise<Response> {
  const session = await getSession();

  if (!session?.accessToken) {
    throw {
      status: 401,
      title: "Non authentifié",
      detail: "Aucun token valide trouvé",
    };
  }

  const headers = new Headers(options.headers);

  if (
    !headers.has("Content-Type") &&
    options.body &&
    typeof options.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${session.accessToken}`);

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    });
    // console.log(await response.json());

    return response;
  } catch (err) {
    // Network-level errors
    throw {
      networkError: true,
      title: "Erreur réseau",
      detail: (err as Error).message,
    };
  }
}

/**
 * Sends an authenticated request to the API and parses the JSON response
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestConfig = {}
): Promise<T> {
  const url = `${ENTRYPOINT}${endpoint}`;

  let response;
  try {
    response = await fetchWithAuth(url, options);
  } catch (err) {
    throw err;
  }

  // No content
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  try {
    // Handle JSON
    if (
      contentType.includes("application/json") ||
      contentType.includes("application/ld+json") ||
      contentType.includes("application/problem+json")
    ) {
      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          title: data.title ?? "Erreur API",
          detail: data.detail ?? JSON.stringify(data),
          violations: data.violations,
          type: data.type,
        };
      }

      return data as T;
    }

    // Fallback for text / html
    const text = await response.text();
    if (!response.ok) {
      throw {
        status: response.status,
        title: "Erreur API",
        detail: text || `HTTP ${response.status}`,
      };
    }

    return text as unknown as T;
  } catch (err) {
    throw {
      status: response?.status ?? 0,
      title: "Réponse invalide",
      detail: (err as Error).message,
    };
  }
}

/**
 * Builds a URL query string from parameters object with improved type safety
 */
export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  const addParam = (key: string, value: unknown): void => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      // Handle nested objects
      Object.entries(value as Record<string, unknown>).forEach(
        ([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
          }
        }
      );
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    addParam(key, value);
  });

  return searchParams.toString();
}

/**
 * Generic API service class for CRUD operations
 */
export class ApiService<T, CreateT = Partial<T>, UpdateT = Partial<T>> {
  constructor(private readonly endpoint: string) {}

  async getAll(
    params: Record<string, unknown> = {}
  ): Promise<ApiCollection<T>> {
    const queryString = buildQueryParams(params);
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    return apiRequest<ApiCollection<T>>(url);
  }

  async getOne(identifier: string | number): Promise<T> {
    const isURI = typeof identifier === "string" && identifier.startsWith("/");
    const url = isURI ? identifier : `${this.endpoint}/${identifier}`;
    return apiRequest<T>(url);
  }

  async create(data: CreateT): Promise<T> {
    return apiRequest<T>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string | number, data: UpdateT): Promise<T> {
    return apiRequest<T>(`${this.endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(data),
    });
  }

  async delete(id: string | number): Promise<void> {
    return apiRequest<void>(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }
}
