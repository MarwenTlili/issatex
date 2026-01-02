import { ApiCollection } from "@/types/resources/ApiCollection";
import { apiRequest, ApiService } from "./base";
import { Client } from "@/types/resources/Client";
import { API_ENDPOINTS } from "@/config/api";

class ClientsApiService extends ApiService<Client> {
  constructor() {
    super(API_ENDPOINTS.CLIENTS);
  }

  getAllByAccountId(id: string) {
    return apiRequest<ApiCollection<Client>>(
      `${API_ENDPOINTS.CLIENTS}?account=${id}`
    );
  }
}

export const clientsApiService = new ClientsApiService();
