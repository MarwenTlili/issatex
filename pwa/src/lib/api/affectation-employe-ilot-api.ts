import { AffectationEmployeIlot } from "@/types/resources/AffectationEmployeIlot";
import { ApiService } from "./base";
import { API_ENDPOINTS } from "@/config/api";

class AffectationEmployeIlotService extends ApiService<AffectationEmployeIlot> {
  constructor() {
    super(API_ENDPOINTS.AFFECTATION_EMPLOYE_ILOT);
  }
}

export const affectationEmployeIlotService =
  new AffectationEmployeIlotService();
