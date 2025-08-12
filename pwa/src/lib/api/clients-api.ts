import { ApiCollection } from "@/types/resources/ApiCollection";
import { apiRequest } from "./base";
import { Client } from "@/types/resources/Client";

export const clientsApi = {
  getAllByAccountId(accountId: string) {
    return apiRequest<ApiCollection<Client>>(
      `/api/clients?account=${accountId}`
    );
  },

  getById(id: number) {
    return apiRequest(`/api/clients/${id}`);
  },

  getByURI(uri: string) {
    return apiRequest<Client>(uri);
  },
};
