import { ApiCollection } from "@/types/resources";
import { apiRequest } from "../api";
import { Planning } from "@/types/resources/Planning";

export const planningsApi = {
  getAll: (page = 1, itemsPerPage = 10) =>
    apiRequest<ApiCollection<Planning>>(
      `/api/plannings?page=${page}&itemsPerPage=${itemsPerPage}`
    ),

  getById: (id: number) => {
    const planning = apiRequest<Planning>(`/api/plannings/${id}`);
    return planning;
  },
};
