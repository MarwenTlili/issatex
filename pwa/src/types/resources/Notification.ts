import type { Item } from "./Item";

export type TypeNotification =
  | "task_assigned"
  | "deadline_reminder"
  | "system_alert"
  | "maintenance_notice"
  | "new_message"
  | "order_status_changed";

export interface Notification extends Item {
  id: number;
  expediteur: string;
  titre: string;
  message: string;
  dateCreation: string;
  lu: boolean;
  type: TypeNotification;
  account: string;
}

export interface NotificationFilters {
  lu?: boolean;
  type?: TypeNotification;
}
