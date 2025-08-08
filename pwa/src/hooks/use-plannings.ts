import { planningsApi } from "@/lib/api/plannings-api";
import { useQuery } from "@tanstack/react-query";

export const usePlannings = (page = 1, itemsPerPage = 10) => {
  return useQuery({
    queryKey: ["plannings"],
    queryFn: () => {
      return planningsApi.getAll(page, itemsPerPage);
    },
  });
};

export const usePlanning = (id: number) => {
  return useQuery({
    queryKey: ["planning", id],
    queryFn: () => planningsApi.getById(id),
    enabled: !!id,
  });
};
