import { useQuery } from "@tanstack/react-query";

import { planningsApi } from "@/lib/api/plannings-api";
import { PlanningsFilters } from "@/types/resources/Planning";

import { QUERY_KEYS } from "@/config/cache";

export const usePlannings = (filters: PlanningsFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLANNINGS, filters],
    queryFn: () => {
      return planningsApi.getAll({ ...filters });
    },
  });
};
