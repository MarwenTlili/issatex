import { tailleOrdreFabricationsApi } from "@/lib/api";
import { ApiCollection } from "@/types/resources";
import {
  TailleArticle,
  TailleOrdreFabrication,
} from "@/types/resources/TailleOrdreFabrication";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTailleOrdreFabrications(
  id?: number,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery<ApiCollection<TailleOrdreFabrication>, Error>({
    queryKey: ["taille-ordre-fabrications", id],
    queryFn: () => {
      if (!id) {
        throw new Error("No ordre fabrication ID provided");
      }
      return tailleOrdreFabricationsApi.getByOrdreFabrication(id);
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
  });
}

export function useCreateTailleOrdreFabrication() {
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
    mutationFn: (data) => tailleOrdreFabricationsApi.create(data),
    onSuccess: (_, variables) => {
      const ordreFabricationId = variables.ordreFabrication.split("/").pop();
      queryClient.invalidateQueries({
        queryKey: ["taille-ordre-fabrications", Number(ordreFabricationId)],
      });
    },
  });
}

export function useUpdateTailleOrdreFabrication() {
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
      tailleOrdreFabricationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taille-ordre-fabrications"],
      });
    },
  });
}

export function useDeleteTailleOrdreFabrication() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => tailleOrdreFabricationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taille-ordre-fabrications"],
      });
    },
  });
}
