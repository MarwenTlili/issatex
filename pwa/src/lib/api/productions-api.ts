import { ApiCollection } from "@/types/resources/ApiCollection";
import { apiRequest, ApiService } from "./base";
import { Production } from "@/types/resources/Production";
import { API_ENDPOINTS } from "@/config/api";

class ProductionsApiService extends ApiService<Production> {
  constructor() {
    super(API_ENDPOINTS.PRODUCTIONS);
  }

  async getAllByPlanningId(planningId: string) {
    return apiRequest<ApiCollection<Production>>(
      `${API_ENDPOINTS.PRODUCTIONS}?planning=${planningId}`
    );
  }

}

export const productionsApi = new ProductionsApiService();
