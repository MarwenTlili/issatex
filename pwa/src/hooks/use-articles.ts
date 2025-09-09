import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentClient } from "./use-clients";
import type {
  ArticlesFilters,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/resources/Article";
import { toast } from "sonner";
import { articlesApi } from "@/lib/api/articles-api";
import { QUERY_KEYS } from "@/config/cache";
import { type ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { MESSAGES } from "@/config/app";

export const useArticles = (filters: ArticlesFilters = {}) => {
  const { data: currentClient } = useCurrentClient();

  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLES, currentClient?.id, filters],
    queryFn: async () => {
      if (!currentClient?.id) {
        throw new Error("Aucun client trouvé");
      }
      return articlesApi.getAllByClientId(currentClient.id, filters);
    },
    enabled: !!currentClient?.id,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useArticle = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLE, `${identifier}`],
    queryFn: () => articlesApi.getOne(identifier!),
    enabled: !!identifier,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const { data: currentClient } = useCurrentClient();

  return useMutation({
    mutationFn: (data: CreateArticleData) => {
      if (!currentClient?.["@id"]) {
        throw new Error("Aucun client trouvé");
      }
      return articlesApi.create({ ...data, client: currentClient["@id"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTICLES] });
      toast.success(MESSAGES.SUCCESS.ARTICLE_CREATED, {
        description: "Le nouvel article a été ajouté à votre collection.",
      });
    },
    onError: (error) => {
      const formErrors = handleApiError(error as ApiError, {
        showToast: false, // Let the form handle validation errors
      });
      // Return form errors for the form to handle
      return formErrors;
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
      toast.success(MESSAGES.SUCCESS.ARTICLE_UPDATED, {
        description: "Vos modifications ont été enregistrées.",
      });
    },
    onError: (error) => {
      const formErrors = handleApiError(error as ApiError, {
        showToast: false, // Let the form handle validation errors
      });
      // Return form errors for the form to handle
      return formErrors;
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTICLES] });
      toast.success(MESSAGES.SUCCESS.ARTICLE_DELETED, {
        description: "L'article a été supprimé de votre collection.",
      });
    },
    onError: (error) =>
      handleApiError(error as ApiError, {
        customMessage: "Impossible de supprimer cet article.",
      }),
  });
};
