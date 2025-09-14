import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { presencesApi } from "@/lib/api/presences-api";
import { QUERY_KEYS, CACHE_CONFIG } from "@/config/cache";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import type {
  PresenceFilters,
  CreatePresenceData,
  UpdatePresenceData,
} from "@/types/resources/Presence";
import { toast } from "sonner";

export const usePresences = (filters: PresenceFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRESENCES, filters],
    queryFn: () => presencesApi.getAll({ ...filters }),
    staleTime: CACHE_CONFIG.STALE_TIME,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const usePresence = (id: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRESENCE, id],
    queryFn: () => presencesApi.getOne(id),
    staleTime: CACHE_CONFIG.STALE_TIME,
    enabled: !!id,
    onError: (err) => handleApiError(err as ApiError),
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
    onError: (err) => {
      handleApiError(err as ApiError);
      toast.error("Erreur lors de la création de la présence");
    },
  });
};

export const useUpdatePresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdatePresenceData;
    }) => presencesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESENCE, id] });
      toast.success("Présence mise à jour avec succès");
    },
    onError: (err) => {
      handleApiError(err as ApiError);
      toast.error("Erreur lors de la mise à jour de la présence");
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
    onError: (err) => {
      handleApiError(err as ApiError);
      toast.error("Erreur lors de la suppression de la présence");
    },
  });
};
