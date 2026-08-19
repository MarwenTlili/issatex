import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateOrdreFabricationData,
  OrdreFabrication,
  OrdreFabricationFilters,
  UpdateOrdreFabricationData,
} from "@/types/resources/OrdreFabrication";
import { ordresFabricationApi } from "@/lib/api/ordres-fabrication-api";
import { useCurrentClient } from "./use-clients";

import { QUERY_KEYS } from "@/config/cache";

export const useOrdreFabrications = (filters: OrdreFabricationFilters = {}) => {
  const { data: currentClient } = useCurrentClient();

  return useQuery({
    queryKey: [QUERY_KEYS.ORDRE_FABRICATIONS, currentClient?.id, filters],
    queryFn: async () => {
      return ordresFabricationApi.getAllByClientId(currentClient!.id, filters);
    },
    enabled: !!currentClient?.id,
  });
};

export const useOrdreFabrication = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDRE_FABRICATION, identifier],
    queryFn: () => ordresFabricationApi.getOne(identifier!),
    enabled: !!identifier,
  });
};

export const useCreateOrdreFabrication = () => {
  const queryClient = useQueryClient();
  const { data: currentClient } = useCurrentClient();

  return useMutation<OrdreFabrication, Error, CreateOrdreFabricationData>({
    mutationFn: async (data: CreateOrdreFabricationData) => {
      return ordresFabricationApi.create({
        ...data,
        client: currentClient!["@id"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDRE_FABRICATIONS, currentClient?.id],
      });
    },
  });
};

export const useUpdateOrdreFabrication = () => {
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();

  return useMutation<OrdreFabrication, Error, UpdateOrdreFabricationData>({
    mutationFn: async (data: UpdateOrdreFabricationData) =>
      ordresFabricationApi.update(data.id, data),
    onSuccess: (updatedOrdreFabrication) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDRE_FABRICATIONS, client?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDRE_FABRICATION, updatedOrdreFabrication.id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.TAILLES_ORDRE_FABRICATION,
          updatedOrdreFabrication.id,
        ],
      });
    },
  });
};

export const useDeleteOrdreFabrication = () => {
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => ordresFabricationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDRE_FABRICATIONS, client?.id],
      });
    },
  });
};
