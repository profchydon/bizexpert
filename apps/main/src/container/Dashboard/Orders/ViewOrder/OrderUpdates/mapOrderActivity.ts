import { OrderActivity } from "@/api/baseQueries/companiesApi/ordersApi/getOrderActivities";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import { FeedItem } from "./FeedItem";

const formatSnakeCasePhrase = (value: string) =>
  value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const formatReadableText = (rawText: string) => {
  if (!rawText) return "";

  const withFormattedSnakeCase = rawText.replaceAll(
    /\b[a-z]+(?:_[a-z]+)+\b/gi,
    (match) => formatSnakeCasePhrase(match),
  );

  return withFormattedSnakeCase
    .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replaceAll(/\s+/g, " ")
    .trim();
};

const getTextValue = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.text === "string") return candidate.text;
    if (typeof candidate.value === "string") return candidate.value;
  }
  return "";
};

const getBadgeStyle = (activity: OrderActivity) => {
  const status = (activity.status || "").toLowerCase();
  if (status in orderStatusMap) {
    const mapped = orderStatusMap[status as ASSET_ORDER_STATUS];

    if (["success"].includes(String(mapped.variant || ""))) {
      return "bg-[#ecfdf3] text-[#067647] ring-[#abefc6]";
    }
    if (
      ["error", "red", "destructive"].includes(String(mapped.variant || ""))
    ) {
      return "bg-[#fef3f2] text-[#b42318] ring-[#fecdca]";
    }
    if (["pending", "awaiting"].includes(String(mapped.variant || ""))) {
      return "bg-[#fffaeb] text-[#b54708] ring-[#fedf89]";
    }
    return "bg-[#eff8ff] text-[#175cd3] ring-[#b2ddff]";
  }

  const badgeText = (activity.badge?.text || "").toLowerCase();
  if (badgeText.includes("not required")) {
    return "bg-[#f9fafb] text-[#344054] ring-[#eaecf0]";
  }
  if (badgeText.includes("delivered") || badgeText.includes("completed")) {
    return "bg-[#ecfdf3] text-[#067647] ring-[#abefc6]";
  }
  if (badgeText.includes("in transit") || badgeText.includes("awaiting")) {
    return "bg-[#fffaeb] text-[#b54708] ring-[#fedf89]";
  }
  return "bg-[#eff8ff] text-[#175cd3] ring-[#b2ddff]";
};

export function isStaleCancelledOrderActivity(
  activity: OrderActivity,
  orderStatus?: string,
): boolean {
  if (orderStatus === "cancelled") return false;
  const status = (activity.status || "").toLowerCase();
  if (status !== "cancelled" && status !== "order_cancelled") return false;
  const title = getTextValue(activity.title?.text).toLowerCase();
  return title.startsWith("order status updated");
}

export function collapseDuplicateCancelledActivities(
  activities: OrderActivity[],
): OrderActivity[] {
  const seen = new Set<string>();
  return activities.filter((activity) => {
    const status = (activity.status || "").toLowerCase();
    if (status !== "cancelled" && status !== "order_cancelled") return true;
    const title = getTextValue(activity.title?.text).toLowerCase();
    const key = `${title}|${status}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function mapActivityToFeedItem(
  activity: OrderActivity,
  index: number,
  total: number,
): FeedItem {
  const titleRaw =
    getTextValue(activity.title?.text) ||
    getTextValue(activity.source?.name) ||
    getTextValue(activity.description);

  const title = formatReadableText(titleRaw);

  const rawDescription =
    getTextValue(activity.description_display?.text) ||
    getTextValue(activity.description);
  const description = formatReadableText(rawDescription);

  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  const shouldHideDescription =
    normalizedDescription === normalizedTitle ||
    normalizedDescription.includes(normalizedTitle) ||
    normalizedTitle.includes(normalizedDescription);

  const actorInitials =
    activity.actor?.initials ||
    activity.actor?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "SC";

  let avatarType: FeedItem["type"] = "initials";
  if (activity.actor?.avatar) {
    avatarType = "image";
  } else if (activity.entity === "order") {
    avatarType = "order";
  } else if (activity.entity === "suborder") {
    avatarType = "suborder";
  } else if (activity.icon?.type === "logo") {
    avatarType = "logo";
  }

  const badgeLabel =
    activity.status && activity.status in orderStatusMap
      ? orderStatusMap[activity.status as ASSET_ORDER_STATUS].label
      : getTextValue(activity.badge?.text);

  return {
    id: activity.id,
    initials: actorInitials,
    type: avatarType,
    imageUrl: activity.actor?.avatar || activity.source?.image || undefined,
    isLast: index === total - 1,
    title,
    time: activity.formatted_timestamp || activity.timestamp,
    description: shouldHideDescription
      ? getTextValue(activity.description_display?.prefix)
      : description,
    highlight: getTextValue(activity.subtitle?.highlight),
    description2: getTextValue(activity.description_display?.link_text),
    showUnreadDot: activity.is_read === false,
    badge: badgeLabel
      ? {
          label: badgeLabel,
          style: getBadgeStyle(activity),
        }
      : undefined,
    message: getTextValue(activity.comment),
    attachment: activity.document?.name
      ? {
          name: activity.document.name,
          size: activity.document.size || undefined,
          extension:
            activity.document.extension ||
            activity.document.name?.split(".")?.pop() ||
            "zip",
        }
      : undefined,
  };
}
