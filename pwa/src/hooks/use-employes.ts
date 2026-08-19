import { useQuery } from "@tanstack/react-query";

import { EmployesFilter } from "@/types/resources/Employe";
import { employesApi } from "@/lib/api/employes-api";

import { QUERY_KEYS, CACHE_CONFIG } from "@/config/cache";

export const useEmployes = (filters: EmployesFilter = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYES, filters],
    queryFn: () => employesApi.getAll({ ...filters }),
    staleTime: CACHE_CONFIG.STALE_TIME,
  });
};

export const useEmploye = (id: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYE, id],
    queryFn: () => employesApi.getOne(id),
    staleTime: CACHE_CONFIG.STALE_TIME,
    enabled: !!id,
  });
};
