import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  PresencesFilters,
  CreatePresenceData,
  UpdatePresenceData,
} from "@/types/resources/Presence";
import { presencesApi } from "@/lib/api/presences-api";

import { QUERY_KEYS, CACHE_CONFIG } from "@/config/cache";

export const usePresences = (filters: PresencesFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRESENCES, filters],
    queryFn: () => presencesApi.getAll({ ...filters }),
    staleTime: CACHE_CONFIG.STALE_TIME,
  });
};

export const usePresence = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRESENCE, identifier],
    queryFn: () => presencesApi.getOne(identifier!),
    staleTime: CACHE_CONFIG.STALE_TIME,
    enabled: !!identifier,
  });
};

export const useCreatePresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePresenceData) => presencesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESENCES] });
      toast.success("Présence créée avec succès");
    },
  });
};

export const useUpdatePresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePresenceData) =>
      presencesApi.update(data.id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESENCE, id] });
      toast.success("Présence mise à jour avec succès");
    },
  });
};

export const useDeletePresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => presencesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESENCES] });
      toast.success("Présence supprimée avec succès");
    },
  });
};
