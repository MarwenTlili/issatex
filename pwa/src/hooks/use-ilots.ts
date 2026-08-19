import { useQuery } from "@tanstack/react-query";

import { ilotsApiService } from "@/lib/api/ilots-api";

import { QUERY_KEYS } from "@/config/cache";

export const useIlots = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ILOTS],
    queryFn: () => ilotsApiService.getAll(),
  });
};

export const useIlot = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ILOT, identifier],
    queryFn: () => ilotsApiService.getOne(identifier!),
    enabled: !!identifier,
  });
};
