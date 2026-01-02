import { QUERY_KEYS } from "@/config/cache";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { planningsApi } from "@/lib/api/plannings-api";
import { PlanningsFilters } from "@/types/resources/Planning";
import { useQuery } from "@tanstack/react-query";

export const usePlannings = (filters: PlanningsFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLANNINGS, filters],
    queryFn: () => {
      return planningsApi.getAll({ ...filters });
    },
    onError: (err) => handleApiError(err as ApiError),
  });
};
