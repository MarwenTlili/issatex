import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ArticlesFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import { articlesApi } from "@/lib/api/articles-api";
import { useCurrentClient } from "@/hooks/use-clients";

import { QUERY_KEYS } from "@/config/cache";

export const useArticles = (filters: ArticlesFilters = {}) => {
  const { data: currentClient } = useCurrentClient();

  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLES, currentClient?.id, filters],
    queryFn: async () => {
      return articlesApi.getAllByClientId(currentClient!.id, filters);
    },
    enabled: !!currentClient?.id,
  });
};

export const useArticle = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLE, identifier],
    queryFn: () => articlesApi.getOne(identifier!),
    enabled: !!identifier,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const { data: currentClient } = useCurrentClient();

  return useMutation({
    mutationFn: (data: CreateArticleData) => {
      return articlesApi.create({ ...data, client: currentClient!["@id"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTICLES] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();

  return useMutation({
    mutationFn: (data: UpdateArticleData) => articlesApi.update(data.id, data),
    onSuccess: (updatedArticle) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLES, client?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLE, updatedArticle.id],
      });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTICLES] });
    },
  });
};
