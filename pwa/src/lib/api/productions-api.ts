import { ApiCollection } from "@/types/resources/ApiCollection";
import { apiRequest } from "./base";
import { Production, ProductionFormData } from "@/types/resources/Production";

export const productionsApi = {
  getAllByPlanningId(planningId: string) {
    return apiRequest<ApiCollection<Production>>(
      `/api/productions?planning=${planningId}`
    );
  },

  getById(id: string) {
    return apiRequest<Production>(`/api/productions/${id}`);
  },

  create(data: ProductionFormData & { planning: string }) {
    return apiRequest<Production>("/api/productions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<ProductionFormData>) {
    return apiRequest<Production>(`/api/productions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return apiRequest<void>(`/api/productions/${id}`, { method: "DELETE" });
  },
};
