import { ApiService } from "./base";
import { API_ENDPOINTS } from "@/config/api";
import type { Employe } from "@/types/resources/Employe";

class EmployesApiService extends ApiService<Employe> {
  constructor() {
    super(API_ENDPOINTS.EMPLOYES);
  }

  async getActive() {
    return this.getAll({ actif: true });
  }
}

export const employesApi = new EmployesApiService();
