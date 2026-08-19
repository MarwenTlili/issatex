import type {
  Notification,
  NotificationFilters,
} from "@/types/resources/Notification";
import { apiRequest, ApiService } from "./base";
import { ApiCollection } from "@/types/resources/ApiCollection";

import { API_ENDPOINTS } from "@/config/api";
import { buildQueryParams } from "@/lib/utils";

class NotificationsApiService extends ApiService<Notification> {
  constructor() {
    super(API_ENDPOINTS.NOTIFICATIONS);
  }

  async getAllByAccountId(
    accountId?: number,
    filters: NotificationFilters = {},
  ): Promise<ApiCollection<Notification>> {
    const params = buildQueryParams({
      account: accountId,
      ...filters,
    });

    return apiRequest<ApiCollection<Notification>>(
      `${API_ENDPOINTS.NOTIFICATIONS}?${params}`,
    );
  }

  async getOne(id: number): Promise<Notification> {
    return apiRequest(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`);
  }

  async markAsRead(id: number): Promise<Notification> {
    return notificationsApi.update(id, { lu: true });
  }

  async markAsUnread(id: number): Promise<Notification> {
    return notificationsApi.update(id, { lu: false });
  }

  async markAllAsRead(notifications: Notification[]): Promise<void> {
    await Promise.all(
      notifications
        .filter((n) => !n.lu)
        .map((n) => notificationsApi.markAsRead(n.id)),
    );
  }

  async delete(id: number): Promise<void> {
    return await apiRequest(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`, {
      method: "DELETE",
    });
  }
}

export const notificationsApi = new NotificationsApiService();
