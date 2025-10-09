import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  Notification,
  NotificationFilters,
} from "@/types/resources/Notification";
import { notificationsApi } from "@/lib/api/notifications-api";
import { type ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { QUERY_KEYS } from "@/config/cache";
import { useCurrentUser } from "./use-current-user";

export const useNotifications = (filters: NotificationFilters = {}) => {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, currentUser?.id, filters],
    queryFn: async () => {
      if (!currentUser?.id) {
        throw new Error("Aucun utilisteur trouvé");
      }
      return notificationsApi.getAllByAccountId(currentUser?.id, filters);
    },
    refetchInterval: 30000, // Refetch every 1 seconds for real-time updates
    enabled: !!currentUser?.id,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, number>({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
    },
    onError: (error) =>
      handleApiError(error as ApiError, {
        customMessage: "Impossible de marquer la notification comme lue.",
      }),
  });
};

export const useMarkNotificationAsUnread = () => {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, number>({
    mutationFn: (id: number) => notificationsApi.markAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
    },
    onError: (error) =>
      handleApiError(error as ApiError, {
        customMessage: "Impossible de marquer la notification com non lue.",
      }),
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
      toast.success("Notification supprimée");
    },
    onError: (error) =>
      handleApiError(error as ApiError, {
        customMessage: "Impossible de supprimer la notification.",
      }),
  });
};
