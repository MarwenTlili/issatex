import {
  CreateOrdreFabricationData,
  OrdreFabrication,
  OrdreFabricationFilters,
  UpdateOrdreFabricationData,
} from "@/types/resources/OrdreFabrication";
import { useCurrentClient } from "./use-clients";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordreFabricationsApi } from "@/lib/api";
import { ApiCollection } from "@/types/resources";

export const useOrdreFabrications = (filters: OrdreFabricationFilters = {}) => {
  const { data: currentClient, error } = useCurrentClient();
  if (error) {
    toast.error("Can't fetch client informations", {
      description: "Error while fetching current client data",
    });
  }
  return useQuery<ApiCollection<OrdreFabrication>, Error>({
    queryKey: ["ordre-fabrications", currentClient?.id, filters],
    queryFn: () => {
      if (!currentClient?.id) {
        throw new Error("No client found");
      }

      return ordreFabricationsApi.getAllByClientId(currentClient.id, filters);
    },
    enabled: !!currentClient?.id,
  });
};

export const useOrdreFabrication = (
  id?: number,
  options?: { enabled?: boolean; staleTime?: number }
) => {
  return useQuery({
    queryKey: ["ordre-fabrication"],
    queryFn: () => {
      if (!id) throw new Error("Cannot fetch ordre fabrication without id!");
      return ordreFabricationsApi.getById(id);
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
  });
};

export const useOrdreFabricationByURI = (
  uri?: string,
  options?: { enabled?: boolean; staleTime?: number }
) => {
  return useQuery({
    queryKey: ["ordre-fabrication", uri],
    queryFn: () => {
      if (!uri) throw new Error("Cannot fetch ordre fabrication without URI!");
      return ordreFabricationsApi.getByURI(uri);
    },
    enabled: !!uri && options?.enabled !== false,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
  });
};

export const useCreateOrdreFabrication = () => {
  const queryClient = useQueryClient();
  const { data: client, error: clientFetchError } = useCurrentClient();

  if (clientFetchError) {
    toast.error("Can't fetch client informations", {
      description: "Error while fetching current client data",
    });
  }

  return useMutation<OrdreFabrication, Error, CreateOrdreFabricationData>({
    mutationFn: (data: CreateOrdreFabricationData) => {
      if (!client?.["@id"]) {
        throw new Error("No client found");
      }
      return ordreFabricationsApi.create(data, client?.["@id"]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ordre-fabrications", client?.id],
      });
      toast.success("Mnufacturing order created successfully", {
        description:
          "The new manufacturing order has been added to your collection.",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
};

export const useUpdateOrdreFabrication = () => {
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();

  return useMutation<OrdreFabrication, Error, UpdateOrdreFabricationData>({
    mutationFn: (data: UpdateOrdreFabricationData) => {
      if (!client?.["@id"]) {
        throw new Error("No client found");
      }
      return ordreFabricationsApi.update(data);
    },
    onSuccess: (updatedOrdreFabrication) => {
      queryClient.invalidateQueries({
        queryKey: ["ordre-fabrications", client?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["ordre-fabrication", updatedOrdreFabrication.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["taille-ordre-fabrications", updatedOrdreFabrication.id],
      });
      toast.success("Manufacturing order updated successfully", {
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
};

export const useDeleteOrdreFabrication = () => {
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => ordreFabricationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ordre-fabrications", client?.id],
      });
      toast.success("Manufacturing order deleted successfully", {
        description:
          "The manufacturing order has been removed from your collection.",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
};
