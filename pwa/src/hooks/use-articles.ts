import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentClient } from "./use-clients";
import {
  Article,
  ArticlesFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import { toast } from "sonner";
import { articlesApi } from "@/lib/api/articles-api";

export const useArticles = (filters: ArticlesFilters = {}) => {
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

      return articlesApi.getAllByClientId(currentClient.id, filters);
    },
    enabled: !!currentClient?.id,
  });
};

export const useArticle = (id: number) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => articlesApi.getById(id),
    enabled: !!id,
  });
};

export const useArticleByURI = (uri: string) => {
  const id = uri.split("/").pop();
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => articlesApi.getByURI(uri),
    enabled: !!uri,
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
      return articlesApi.create({ ...data, clientId: currentClient.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article created successfully", {
        description: "The new article has been added to your collection.",
      });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();

  return useMutation({
    mutationFn: (data: UpdateArticleData) => articlesApi.update(data),
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
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article deleted successfully", {
        description: "The article has been removed from your collection.",
      });
    },
  });
};
