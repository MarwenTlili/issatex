import { ilotApi } from "@/lib/api/ilots-api";
import { useQuery } from "@tanstack/react-query";

export const useIlot = (id: string) => {
  return useQuery({
    queryKey: ["ilot", id],
    queryFn: () => ilotApi.getByURI(id),
    enabled: !!id,
  });
};

export const useIlots = () => {
  return useQuery({
    queryKey: ["ilots"],
    queryFn: () => ilotApi.getAll(),
  });
};
