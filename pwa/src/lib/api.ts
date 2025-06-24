import { getSession } from "next-auth/react";

import { ENTRYPOINT } from "@/config/entrypoint";
import {
  Article,
  ArticleFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import { Client } from "@/types/resources/Client";
import { ApiCollection } from "@/types/resources";

// Fetch resources using JWT token
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession();

  if (!session?.accessToken) throw new Error("No valid session found");

  const headers = new Headers(options.headers);

  // Set default Content-Type only if it's not provided
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

// Generic fetch function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(`${ENTRYPOINT}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // 204 No Content responses have no body
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

// Client API functions
export const clientApi = {
  getByAccountId: (accountId: string) =>
    apiRequest<ApiCollection<Client>>(`/api/clients?account=${accountId}`),

  getById: (id: number): Promise<Client> => apiRequest(`/api/clients/${id}`),
};

// Article API functions
export const articleApi = {
  getAllByClientId: (clientId: number, filters: ArticleFilters = {}) => {
    const params = new URLSearchParams();

    params.append("client", clientId.toString());

    if (filters.ref) {
      params.append("ref", filters.ref);
    }

    if (filters.page) {
      params.append("page", filters.page.toString());
    }

    if (filters.itemsPerPage) {
      params.append("itemsPerPage", filters.itemsPerPage.toString());
    }

    if (filters.order) {
      Object.entries(filters.order).forEach(([key, value]) => {
        params.append(`order[${key}]`, value);
      });
    }

    return apiRequest<ApiCollection<Article>>(
      `/api/articles?${params.toString()}`,
      {}
    );
  },

  getById: (id: number) => apiRequest<Article>(`/api/articles/${id}`),

  create: (data: CreateArticleData & { clientId: number }) =>
    apiRequest<Article>("/api/articles", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        client: `/api/clients/${data.clientId}`,
      }),
    }),

  update: (data: UpdateArticleData) => {
    const { id, ...updateData } = data;
    return apiRequest<Article>(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(updateData),
    });
  },

  delete: (id: number): Promise<void> =>
    apiRequest<void>(`/api/articles/${id}`, {
      method: "DELETE",
    }),
};
