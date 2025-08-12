import { taillesOrdreFabricationApi } from "@/lib/api/tailles-ordre-fabrication-api";
import { ApiCollection } from "@/types/resources/ApiCollection";
import {
  TailleArticle,
  TailleOrdreFabrication,
} from "@/types/resources/TailleOrdreFabrication";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTailleOrdreFabrications = (
  ordreFabricationId?: number,
  options?: { enabled?: boolean; staleTime?: number }
) => {
  return useQuery<ApiCollection<TailleOrdreFabrication>, Error>({
    queryKey: ["taille-ordre-fabrications", ordreFabricationId],
    queryFn: () => {
      if (!ordreFabricationId) {
        throw new Error("No ordre fabrication ID provided");
      }
      return taillesOrdreFabricationApi.getAllByOrdreFabricationId(
        ordreFabricationId
      );
    },
    enabled: !!ordreFabricationId && options?.enabled !== false,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
  });
};

export const useTaillesByOrdreFabricationURI = (uri: string) => {
  return useQuery({
    queryKey: ["tailles-ordre-fabrication", uri],
    queryFn: () => taillesOrdreFabricationApi.getAllByOrdreFabricationURI(uri),
    enabled: !!uri,
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
      const ordreFabricationId = variables.ordreFabrication.split("/").pop();
      queryClient.invalidateQueries({
        queryKey: ["taille-ordre-fabrications", Number(ordreFabricationId)],
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
        queryKey: ["taille-ordre-fabrications"],
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
        queryKey: ["taille-ordre-fabrications"],
      });
    },
  });
};
