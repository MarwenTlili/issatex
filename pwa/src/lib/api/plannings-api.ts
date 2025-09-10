import { ApiService } from "./base";
import { Planning } from "@/types/resources/Planning";
import { API_ENDPOINTS } from "@/config/api";

class PlanningsApiService extends ApiService<Planning> {
  constructor() {
    super(API_ENDPOINTS.PLANNINGS);
  }
}

export const planningsApi = new PlanningsApiService();
