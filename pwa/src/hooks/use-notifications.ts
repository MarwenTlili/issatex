import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Notification,
  NotificationFilters,
} from "@/types/resources/Notification";
import { notificationsApi } from "@/lib/api/notifications-api";
import { type ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { QUERY_KEYS } from "@/config/cache";
import { useCurrentUser } from "./use-current-user";
import { useMercureNotifications } from "@/mercure/useMercureNotifications";

export const useNotifications = (filters: NotificationFilters = {}) => {
  const { data: currentUser } = useCurrentUser();

  // Subscribe to Mercure when user is logged in
  useMercureNotifications(currentUser?.id, filters);

  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, currentUser?.id, filters],
    queryFn: async () => {
      if (!currentUser?.id) {
        throw new Error("Aucun utilisteur trouvé");
      }
      return notificationsApi.getAllByAccountId(currentUser?.id, filters);
    },
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
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: () => {
      // user.id is required for query key consistency
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS, currentUser?.id],
        exact: false, // with or without filters
      });
    },
    onError: (error) =>
      handleApiError(error as ApiError, {
        customMessage: "Impossible de supprimer la notification.",
      }),
  });
};
