import { QUERY_KEYS } from "@/config/cache";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { taillesOrdreFabricationApi } from "@/lib/api/tailles-ordre-fabrication-api";
import { ApiCollection } from "@/types/resources/ApiCollection";
import {
  TailleArticle,
  TailleOrdreFabrication,
} from "@/types/resources/TailleOrdreFabrication";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTaillesByOrdreFabrication = (identifier?: string | number) => {
  return useQuery<ApiCollection<TailleOrdreFabrication>, Error>({
    queryKey: [QUERY_KEYS.TAILLES_ORDRE_FABRICATION, `${identifier}`],
    queryFn: () => {
      if (!identifier) {
        throw new Error("Aucun ordre de fabrication avec cette ID");
      }
      return taillesOrdreFabricationApi.getAllByOrdreFabrication(identifier);
    },
    enabled: !!identifier,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useCreateTailleOrdreFabrication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TailleOrdreFabrication,
    Error,
    {
      tailleArticle: TailleArticle;
      quantite: number;
      ordreFabrication: string;
    }
  >({
    mutationFn: (data) => taillesOrdreFabricationApi.create(data),
    onSuccess: (_, variables) => {
      const id = variables.ordreFabrication.split("/").pop();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAILLES_ORDRE_FABRICATION, `${id}`],
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

export const useUpdateTailleOrdreFabrication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TailleOrdreFabrication,
    Error,
    {
      id: number;
      tailleArticle: TailleArticle;
      quantite: number;
    }
  >({
    mutationFn: ({ id, ...data }) =>
      taillesOrdreFabricationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAILLES_ORDRE_FABRICATION],
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

export const useDeleteTailleOrdreFabrication = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => taillesOrdreFabricationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAILLES_ORDRE_FABRICATION],
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
