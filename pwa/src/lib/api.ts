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
import {
  CreateOrdreFabricationData,
  OrdreFabrication,
  OrdreFabricationFilters,
  UpdateOrdreFabricationData,
} from "@/types/resources/OrdreFabrication";
import {
  TailleArticle,
  TailleOrdreFabrication,
} from "@/types/resources/TailleOrdreFabrication";

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
export async function apiRequest<T>(
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

  getById: (id: number) => apiRequest(`/api/clients/${id}`),

  getByURI: (uri: string) => apiRequest<Client>(uri),
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

  getByURI: (uri: string) => apiRequest<Article>(uri),

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

// Ordre Fabrication functions
export const ordreFabricationsApi = {
  getAllByClientId: async (
    clientId: number,
    filters: OrdreFabricationFilters = {}
  ) => {
    const params = new URLSearchParams({
      client: clientId.toString(),
      ...(filters.ref && { ref: filters.ref }),
      ...(filters.statut && { statut: filters.statut }),
      ...(filters.urgent !== undefined && {
        urgent: filters.urgent.toString(),
      }),
      ...(filters.page && { page: filters.page.toString() }),
      ...(filters.itemsPerPage && {
        itemsPerPage: filters.itemsPerPage.toString(),
      }),
    });

    // Add ordering parameters
    if (filters.order) {
      Object.entries(filters.order).forEach(([field, direction]) => {
        params.append(`order[${field}]`, direction);
      });
    }

    return apiRequest<ApiCollection<OrdreFabrication>>(
      `/api/ordre_fabrications?${params.toString()}`
    );
  },

  getById: async (id: number) => {
    return apiRequest<OrdreFabrication>(`/api/ordre_fabrications/${id}`);
  },

  getByURI: async (uri: string) => {
    return apiRequest<OrdreFabrication>(uri);
  },

  create: async (data: CreateOrdreFabricationData, clientUri: string) => {
    // First create the OrdreFabrication without tailleOFs
    const { tailleOFs, ...ordreFabricationData } = data;

    const ordreFabrication = await apiRequest<OrdreFabrication>(
      "/api/ordre_fabrications",
      {
        method: "POST",
        body: JSON.stringify({
          ...ordreFabricationData,
          dateCreation: new Date().toISOString(),
          statut: "Cree",
          lance: false,
          client: clientUri,
        }),
      }
    );

    // Then create each TailleOrdreFabrication
    const tailleOFPromises = tailleOFs.map((tailleOF) =>
      tailleOrdreFabricationsApi.create({
        ...tailleOF,
        ordreFabrication: ordreFabrication["@id"],
      })
    );

    await Promise.all(tailleOFPromises);

    return ordreFabrication;
  },

  update: async (data: UpdateOrdreFabricationData) => {
    const { id, tailleOFs, ...updateData } = data;

    // Update the OrdreFabrication
    const ordreFabrication = await apiRequest<OrdreFabrication>(
      `/api/ordre_fabrications/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/merge-patch+json" },
        body: JSON.stringify(updateData),
      }
    );

    if (tailleOFs) {
      // Get existing TailleOrdreFabrication
      const existingTailleOFs =
        await tailleOrdreFabricationsApi.getByOrdreFabrication(id);

      // Delete existing TailleOrdreFabrication
      await Promise.all(
        existingTailleOFs.member.map((tof) =>
          tailleOrdreFabricationsApi.delete(tof.id)
        )
      );

      // Create new TailleOrdreFabrication
      const tailleOFPromises = tailleOFs.map((tailleOF) =>
        tailleOrdreFabricationsApi.create({
          ...tailleOF,
          ordreFabrication: ordreFabrication["@id"],
        })
      );

      await Promise.all(tailleOFPromises);
    }

    return ordreFabrication;
  },

  delete: async (id: number): Promise<void> => {
    // First delete associated TailleOrdreFabrication
    const tailleOFs = await tailleOrdreFabricationsApi.getByOrdreFabrication(
      id
    );
    await Promise.all(
      tailleOFs.member.map((tof) => tailleOrdreFabricationsApi.delete(tof.id))
    );

    // Then delete the OrdreFabrication
    await apiRequest<void>(`/api/ordre_fabrications/${id}`, {
      method: "DELETE",
    });
  },
};

// Ordre Taille Fabrication functions
export const tailleOrdreFabricationsApi = {
  getByOrdreFabrication: async (ordreFabricationId: number) => {
    return apiRequest<ApiCollection<TailleOrdreFabrication>>(
      `/api/taille_ordre_fabrications?ordreFabrication=${ordreFabricationId}`
    );
  },

  getByOrdreFabricationURI: (uri: string) => {
    const ordreFabricationId = uri.split("/").pop();
    return apiRequest<ApiCollection<TailleOrdreFabrication>>(
      `/api/taille_ordre_fabrications?ordreFabrication=${ordreFabricationId}`
    );
  },

  create: async (data: {
    tailleArticle: TailleArticle;
    quantite: number;
    ordreFabrication: string;
  }) => {
    return apiRequest<TailleOrdreFabrication>(
      "/api/taille_ordre_fabrications",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  update: async (
    id: number,
    data: {
      tailleArticle: TailleArticle;
      quantite: number;
    }
  ) => {
    return apiRequest<TailleOrdreFabrication>(
      `/api/taille_ordre_fabrications/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: number) => {
    await apiRequest<void>(`/api/taille_ordre_fabrications/${id}`, {
      method: "DELETE",
    });
  },
};
