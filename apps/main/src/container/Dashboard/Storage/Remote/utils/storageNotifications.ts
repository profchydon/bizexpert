import {
  type NotificationItem,
  loadNotifications,
  saveNotifications,
} from "@/utils/notification-store";

/** Append a portal notification for a storage event (doc §10). Capped + prepended. */
export function pushStorageNotification(input: {
  type?: NotificationItem["type"];
  title: string;
  description: string;
}) {
  if (typeof window === "undefined") return;
  const item: NotificationItem = {
    id: `stg-${Date.now().toString(36)}-${Math.floor(performance.now())}`,
    type: input.type ?? "info",
    title: input.title,
    description: input.description,
    read: false,
  };
  saveNotifications([item, ...loadNotifications()].slice(0, 20));
}
