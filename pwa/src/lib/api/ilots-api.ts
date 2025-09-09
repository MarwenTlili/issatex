import { Ilot } from "@/types/resources/Ilot";
import { ApiService } from "./base";
import { API_ENDPOINTS } from "@/config/api";

class IlotsApiService extends ApiService<Ilot> {
  constructor() {
    super(API_ENDPOINTS.ILOTS);
  }
}

export const ilotsApiService = new IlotsApiService();
