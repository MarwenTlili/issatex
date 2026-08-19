import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Notification,
  NotificationFilters,
} from "@/types/resources/Notification";
import { notificationsApi } from "@/lib/api/notifications-api";
import { useCurrentUser } from "./use-current-user";
import { useMercureNotifications } from "@/mercure/useMercureNotifications";

import { QUERY_KEYS } from "@/config/cache";

export const useNotifications = (filters: NotificationFilters = {}) => {
  const { data: currentUser } = useCurrentUser();

  // Subscribe to Mercure when user is logged in
  useMercureNotifications(currentUser?.id, filters);

  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, currentUser?.id, filters],
    queryFn: async () => {
      return notificationsApi.getAllByAccountId(currentUser?.id, filters);
    },
    enabled: !!currentUser?.id,
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
  });
};
