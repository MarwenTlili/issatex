import { QUERY_KEYS } from "@/config/cache";
import { affectationEmployeIlotService } from "@/lib/api/affectation-employe-ilot-api";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { AffectationEmployeIlotFilters } from "@/types/resources/AffectationEmployeIlot";
import { useQuery } from "@tanstack/react-query";

export const useAffectationEmployeIlot = (
  filters: AffectationEmployeIlotFilters = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AFFECTATIONS_EMPLOYE_ILOT, filters],
    queryFn: async () => {
      return affectationEmployeIlotService.getAll({ ...filters });
    },
    onError: (err) => handleApiError(err as ApiError),
  });
};
