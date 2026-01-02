import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateOrdreFabricationData,
  OrdreFabrication,
  OrdreFabricationFilters,
  UpdateOrdreFabricationData,
} from "@/types/resources/OrdreFabrication";
import { ordresFabricationApi } from "@/lib/api/ordres-fabrication-api";
import { useCurrentClient } from "./use-clients";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { QUERY_KEYS } from "@/config/cache";
import { MESSAGES } from "@/config/app";

export const useOrdreFabrications = (filters: OrdreFabricationFilters = {}) => {
  const { data: currentClient } = useCurrentClient();

  return useQuery({
    queryKey: [QUERY_KEYS.ORDRE_FABRICATIONS, currentClient?.id, filters],
    queryFn: async () => {
      if (!currentClient?.id) {
        throw new Error("Aucun client trouvé");
      }
      return ordresFabricationApi.getAllByClientId(currentClient.id, filters);
    },
    enabled: !!currentClient?.id,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useOrdreFabrication = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDRE_FABRICATION, `${identifier}`],
    queryFn: () => ordresFabricationApi.getOne(identifier!),
    enabled: !!identifier,
    // refetchOnMount: "always",
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useCreateOrdreFabrication = () => {
  const queryClient = useQueryClient();
  const { data: currentClient } = useCurrentClient();

  return useMutation<OrdreFabrication, Error, CreateOrdreFabricationData>({
    mutationFn: async (data: CreateOrdreFabricationData) => {
      if (!currentClient?.["@id"]) {
        throw new Error("Aucun client trouvé");
      }
      return ordresFabricationApi.create({
        ...data,
        client: currentClient["@id"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDRE_FABRICATIONS, currentClient?.id],
      });
      toast.success(MESSAGES.SUCCESS.ORDRE_FABRICATION_CREATED, {
        description:
          "Le nouvel ordre de fabrication a été ajouté à votre collection.",
      });
    },
    onError: (error) => {
      const formErrors = handleApiError(error as ApiError, {
        showToast: false,
      });
      return formErrors;
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
      toast.success(MESSAGES.SUCCESS.ORDRE_FABRICATION_UPDATED, {
        description: "Vos modifications ont été enregistrées.",
      });
    },
    onError: (error) => {
      const formErrors = handleApiError(error as ApiError, {
        showToast: false,
      });
      return formErrors;
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
      toast.success(MESSAGES.SUCCESS.ORDRE_FABRICATION_DELETED, {
        description:
          "L'ordre de fabrication a été supprimé de votre collection.",
      });
    },
    onError: (error) =>
      handleApiError(error as ApiError, {
        customMessage: "Impossible de supprimer cet Ordre de fabrication.",
      }),
  });
};
