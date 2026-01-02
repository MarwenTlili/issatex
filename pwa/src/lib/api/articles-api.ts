import { ApiService, apiRequest, buildQueryParams } from "./base";
import type {
  Article,
  ArticlesFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import type { ApiCollection } from "@/types/resources/ApiCollection";
import { API_ENDPOINTS } from "@/config/api";

class ArticlesApiService extends ApiService<
  Article,
  CreateArticleData,
  UpdateArticleData
> {
  constructor() {
    super(API_ENDPOINTS.ARTICLES);
  }

  async getAllByClientId(
    clientId: number,
    filters: ArticlesFilters = {}
  ): Promise<ApiCollection<Article>> {
    const params = buildQueryParams({
      client: clientId,
      ...filters,
    });

    return apiRequest<ApiCollection<Article>>(
      `${API_ENDPOINTS.ARTICLES}?${params}`
    );
  }
}

export const articlesApi = new ArticlesApiService();
