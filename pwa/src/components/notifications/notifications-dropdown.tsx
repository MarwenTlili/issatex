import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useMarkNotificationAsRead,
  useMarkNotificationAsUnread,
  useNotifications,
} from "@/hooks/use-notifications";
import { Bell, EllipsisVertical } from "lucide-react";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Notification } from "@/types/resources/Notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function NotificationsDropdown() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notificationsCollection } = useNotifications();
  const markNotificationAsRead = useMarkNotificationAsRead();
  const markNotificationAsUnread = useMarkNotificationAsUnread();

  const notifications = notificationsCollection?.member || [];
  const unreadCount = notifications.filter((n) => !n.lu).length;

  const openNotification = async (n: Notification) => {
    setNotificationsOpen(false);
    setSelectedNotification(n);
    markNotificationAsRead.mutate(n.id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Skip clicks inside elements marked as safe
      if (target.closest("[data-safe-click]")) return;

      const dropdownNode = dropdownRef.current;
      const clickedInsideDropdown = dropdownNode?.contains(target);

      if (!clickedInsideDropdown) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-14 flex justify-end">
      <button
        className={clsx(
          `flex items-center focus:outline-none rounded-full px-2`,
          `hover:bg-gray-200/50`,
          notificationsOpen && `bg-gray-200/50`
        )}
        onClick={(e) => {
          e.stopPropagation();
          setNotificationsOpen((prev) => !prev);
        }}
        aria-expanded={notificationsOpen}
        aria-label="Notifications"
      >
        <Bell
          className={clsx(
            `rounded-full`,
            notificationsOpen ? `text-blue-600 dark:text-blue-400` : ``,
            unreadCount > 0 && `text-red-600 dark:text-red-400`
          )}
          aria-label={`${unreadCount} unread notifications`}
        />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 rounded-full px-1 font-mono tabular-nums bg-gray-100/50"
            variant="outline"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </button>
      {notificationsOpen && (
        <div className="fixed right-4 top-14 w-80 md:absolute md:right-0 md:top-10 z-50">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Dernières activités
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Pas de notifications pour le moment
                </div>
              ) : (
                <ScrollArea className="h-64">
                  {notifications.map((n, index) => (
                    <div
                      key={n.id}
                      className="group relative"
                      onClick={() => openNotification(n)}
                    >
                      <div
                        className={clsx(
                          "px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-start justify-between",
                          !n.lu && "bg-slate-50 dark:bg-gray-700/50"
                        )}
                      >
                        <div className="flex-1 pr-2">
                          <p className="text-sm font-semibold">{n.titre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(n.dateCreation || "").toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2">
                            {n.message}
                          </p>
                        </div>

                        {/* Ellipsis shown only on hover */}
                        <div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                data-safe-click
                              >
                                <EllipsisVertical className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" data-safe-click>
                              {!n.lu ? (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markNotificationAsRead.mutateAsync(n.id);
                                  }}
                                >
                                  Marquer comme lu
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markNotificationAsUnread.mutateAsync(n.id);
                                  }}
                                >
                                  Marquer comme non lu
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openNotification(n);
                                }}
                              >
                                Détails
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <Dialog
        open={!!selectedNotification}
        onOpenChange={() => setSelectedNotification(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.titre}</DialogTitle>
            <DialogDescription>
              {new Date(
                selectedNotification?.dateCreation || ""
              ).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
            {selectedNotification?.message}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
