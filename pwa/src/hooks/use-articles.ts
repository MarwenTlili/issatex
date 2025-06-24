import { articleApi } from "@/lib/api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentClient } from "./use-clients";
import {
  Article,
  ArticleFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import { toast } from "sonner";

export const useArticles = (filters: ArticleFilters = {}) => {
  const { data: currentClient, error } = useCurrentClient();
  if (error) {
    toast.error("Can't fetch client informations", {
      description: "Error while fetching current client data",
    });
  }
  return useQuery({
    queryKey: ["articles", currentClient?.id, filters],
    queryFn: () => {
      if (!currentClient?.id) {
        throw new Error("No client found");
      }

      return articleApi.getAllByClientId(currentClient.id, filters);
    },
    enabled: !!currentClient?.id,
  });
};

export const useArticle = (id: number) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => articleApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const { data: currentClient } = useCurrentClient();
  return useMutation({
    mutationFn: (data: CreateArticleData) => {
      if (!currentClient?.id) {
        throw new Error("No client found");
      }
      return articleApi.create({ ...data, clientId: currentClient.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article created successfully", {
        description: "The new article has been added to your collection.",
      });
    },
  });
};

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();

  return useMutation<Article, Error, UpdateArticleData>({
    mutationFn: (data) => articleApi.update(data),
    onSuccess: (updatedArticle) => {
      queryClient.invalidateQueries({ queryKey: ["articles", client?.id] });
      queryClient.invalidateQueries({
        queryKey: ["article", updatedArticle.id],
      });
      toast.success("Article updated successfully", {
        description: "Your changes have been saved.",
      });
    },
  });
}

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => articleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article deleted successfully", {
        description: "The article has been removed from your collection.",
      });
    },
  });
};
