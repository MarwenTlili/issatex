import { useQuery } from "@tanstack/react-query";

import { AffectationEmployeIlotFilters } from "@/types/resources/AffectationEmployeIlot";
import { affectationEmployeIlotService } from "@/lib/api/affectation-employe-ilot-api";

import { QUERY_KEYS } from "@/config/cache";

export const useAffectationEmployeIlot = (
  filters: AffectationEmployeIlotFilters = {},
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AFFECTATIONS_EMPLOYE_ILOT, filters],
    queryFn: async () => {
      return affectationEmployeIlotService.getAll({ ...filters });
    },
  });
};
