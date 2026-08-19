import { ApiService, apiRequest } from "@/lib/api/base";
import type {
  Article,
  ArticlesFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import type { ApiCollection } from "@/types/resources/ApiCollection";
import { buildQueryParams } from "@/lib/utils";
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
    clientId: number | undefined,
    filters: ArticlesFilters = {},
  ): Promise<ApiCollection<Article>> {
    const params = buildQueryParams({
      client: clientId,
      ...filters,
    });

    return apiRequest<ApiCollection<Article>>(
      `${API_ENDPOINTS.ARTICLES}?${params}`,
    );
  }
}

export const articlesApi = new ArticlesApiService();
