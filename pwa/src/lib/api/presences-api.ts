import { ApiService } from "./base";
import type {
  Presence,
  CreatePresenceData,
  UpdatePresenceData,
} from "@/types/resources/Presence";
import { API_ENDPOINTS } from "@/config/api";

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

  async getByDateRange(startDate: string, endDate: string) {
    return this.getAll({
      "datePresence[after]": startDate,
      "datePresence[before]": endDate,
    });
  }
}

export const presencesApi = new PresencesApiService();
