import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiCollection } from "@/types/resources/ApiCollection";
import {
  TailleArticle,
  TailleOrdreFabrication,
} from "@/types/resources/TailleOrdreFabrication";
import { taillesOrdreFabricationApi } from "@/lib/api/tailles-ordre-fabrication-api";

import { QUERY_KEYS } from "@/config/cache";

export const useTaillesByOrdreFabrication = (identifier?: string | number) => {
  return useQuery<ApiCollection<TailleOrdreFabrication>, Error>({
    queryKey: [QUERY_KEYS.TAILLES_ORDRE_FABRICATION, identifier],
    queryFn: () => {
      return taillesOrdreFabricationApi.getAllByOrdreFabrication(identifier);
    },
    enabled: !!identifier,
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
        queryKey: [QUERY_KEYS.TAILLES_ORDRE_FABRICATION, id],
      });
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
  });
};
