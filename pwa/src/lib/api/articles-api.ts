import {
  Article,
  ArticlesFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import { apiRequest, buildQueryParams } from "./base";
import { ApiCollection } from "@/types/resources/ApiCollection";

export const articlesApi = {
  getAllByClientId(clientId: number, filters: ArticlesFilters = {}) {
    const params = buildQueryParams({
      client: clientId,
      ...filters,
    });

    return apiRequest<ApiCollection<Article>>(`/api/articles?${params}`, {});
  },

  getById(id: number) {
    return apiRequest<Article>(`/api/articles/${id}`);
  },

  getByURI(uri: string) {
    return apiRequest<Article>(uri);
  },

  create(data: CreateArticleData & { clientId: number }) {
    return apiRequest<Article>("/api/articles", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        client: `/api/clients/${data.clientId}`,
      }),
    });
  },

  update(data: UpdateArticleData) {
    const { id, ...updateData } = data;
    return apiRequest<Article>(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(updateData),
    });
  },

  delete(id: number): Promise<void> {
    return apiRequest<void>(`/api/articles/${id}`, {
      method: "DELETE",
    });
  },
};
