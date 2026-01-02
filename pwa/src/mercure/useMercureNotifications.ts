import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { QUERY_KEYS } from "@/config/cache";
import { useMercure } from "./useMercure";
import type {
  Notification,
  NotificationFilters,
} from "@/types/resources/Notification";

export function useMercureNotifications(
  userId?: string | number,
  filters?: NotificationFilters
) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  useMercure<Notification>({
    topic: userId
      ? `/api/users/${userId}`
      : null,
    mercureJwt: session?.mercureJwt || "",
    onMessage: (notification) => {
      if (!userId) return;
      queryClient.setQueryData(
        [QUERY_KEYS.NOTIFICATIONS, userId, filters],
        (old: any) => {
          if (!old) return { member: [notification] };

          const existsIndex = old.member.findIndex(
            (n: Notification) => n.id === notification.id
          );
          let updatedMembers;

          if (existsIndex >= 0) {
            // Replace the existing notification
            updatedMembers = [...old.member];
            updatedMembers[existsIndex] = notification;
          } else {
            // Add new notification at the top
            updatedMembers = [notification, ...old.member];
          }

          return { ...old, member: updatedMembers };
        }
      );
    },
  });
}
