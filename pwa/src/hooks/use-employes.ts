import { useQuery } from "@tanstack/react-query";
import { employesApi } from "@/lib/api/employes-api";
import { QUERY_KEYS, CACHE_CONFIG } from "@/config/cache";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";

export const useEmployes = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYES, filters],
    queryFn: () => employesApi.getAll(filters),
    staleTime: CACHE_CONFIG.STALE_TIME,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useActiveEmployes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYES, "active"],
    queryFn: () => employesApi.getActive(),
    staleTime: CACHE_CONFIG.STALE_TIME,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useEmploye = (id: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYE, id],
    queryFn: () => employesApi.getOne(id),
    staleTime: CACHE_CONFIG.STALE_TIME,
    enabled: !!id,
    onError: (err) => handleApiError(err as ApiError),
  });
};
