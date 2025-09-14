import { ApiService } from "./base";
import { API_ENDPOINTS } from "@/config/api";
import type {
  Presence,
  CreatePresenceData,
  UpdatePresenceData,
} from "@/types/resources/Presence";

class PresencesApiService extends ApiService<
  Presence,
  CreatePresenceData,
  UpdatePresenceData
> {
  constructor() {
    super(API_ENDPOINTS.PRESENCES);
  }

  async getByEmployee(employeeId: string | number) {
    return this.getAll({ employe: employeeId });
  }

  async getByProduction(productionId: string | number) {
    return this.getAll({ production: productionId });
  }

  async getByDateRange(startDate: string, endDate: string) {
    return this.getAll({
      "datePresence[after]": startDate,
      "datePresence[before]": endDate,
    });
  }
}

export const presencesApi = new PresencesApiService();
