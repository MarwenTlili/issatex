import { QUERY_KEYS } from "@/config/cache";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { productionsApi } from "@/lib/api/productions-api";
import { ProductionFormData } from "@/lib/validation/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProductions = (planningId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTIONS],
    queryFn: () => productionsApi.getAllByPlanningId(planningId),
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useProduction = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTION, `${identifier}`],
    queryFn: () => productionsApi.getOne(identifier!),
    enabled: !!identifier,
    onError: (err) => handleApiError(err as ApiError),
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
    onError: (error) => {
      const formErrors = handleApiError(error as ApiError, {
        showToast: false,
      });
      return formErrors;
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
    onError: (error) => {
      const formErrors = handleApiError(error as ApiError, {
        showToast: false,
      });
      return formErrors;
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
    onError: (error) =>
      handleApiError(error as ApiError, {
        customMessage: "Impossible de supprimer cet production.",
      }),
  });
};
