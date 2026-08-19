import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ProductionFormData } from "@/lib/validation/schemas";
import { productionsApi } from "@/lib/api/productions-api";

import { QUERY_KEYS } from "@/config/cache";

export const useProductions = (planningId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTIONS],
    queryFn: () => productionsApi.getAllByPlanningId(planningId),
  });
};

export const useProduction = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTION, identifier],
    queryFn: () => productionsApi.getOne(identifier!),
    enabled: !!identifier,
  });
};

export const useCreateProduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductionFormData & { planning: string }) =>
      productionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANNINGS] });
    },
  });
};

export const useUpdateProduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductionFormData>;
    }) => productionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANNINGS] });
    },
  });
};

export const useDeleteProduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANNINGS] });
    },
  });
};
