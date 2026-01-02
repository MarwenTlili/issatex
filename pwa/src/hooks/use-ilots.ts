import { QUERY_KEYS } from "@/config/cache";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { ilotsApiService } from "@/lib/api/ilots-api";
import { useQuery } from "@tanstack/react-query";

export const useIlots = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ILOTS],
    queryFn: () => ilotsApiService.getAll(),
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useIlot = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ILOT, `${identifier}`],
    queryFn: () => ilotsApiService.getOne(identifier!),
    enabled: !!identifier,
    onError: (err) => handleApiError(err as ApiError),
  });
};
