import { productionsApi } from "@/lib/api/productions-api";
import { ProductionFormData } from "@/types/resources/Production";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProductions = (planningId: string) => {
  return useQuery({
    queryKey: ["productions"],
    queryFn: () => productionsApi.getAllByPlanning(planningId),
  });
};

export const useProduction = (id: string) => {
  return useQuery({
    queryKey: ["production", id],
    queryFn: () => productionsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductionFormData & { planning: string }) =>
      productionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productions"] });
      queryClient.invalidateQueries({ queryKey: ["plannings"] });
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
      queryClient.invalidateQueries({ queryKey: ["productions"] });
      queryClient.invalidateQueries({ queryKey: ["plannings"] });
    },
  });
};

export const useDeleteProduction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productions"] });
      queryClient.invalidateQueries({ queryKey: ["plannings"] });
    },
  });
};
