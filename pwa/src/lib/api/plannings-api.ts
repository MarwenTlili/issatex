import { ApiCollection } from "@/types/resources/ApiCollection";
import { apiRequest } from "./base";
import { Planning } from "@/types/resources/Planning";

export const planningsApi = {
  getAll(page = 1, itemsPerPage = 10) {
    return apiRequest<ApiCollection<Planning>>(
      `/api/plannings?page=${page}&itemsPerPage=${itemsPerPage}`
    );
  },

  getById: (id: number) => {
    return apiRequest<Planning>(`/api/plannings/${id}`);
  },
};
