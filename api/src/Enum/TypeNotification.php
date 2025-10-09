<?php

namespace App\Enum;

enum TypeNotification: string {
    case TASK_ASSIGNED = 'task_assigned';
    case DEADLINE_REMINDER = 'deadline_reminder';
    case SYSTEM_ALERT = 'system_alert';
    case MAINTENANCE_NOTICE = 'maintenance_notice';
    case NEW_MESSAGE = 'new_message';
    case ORDER_STATUS_CHANGED = 'order_status_changed';
}
