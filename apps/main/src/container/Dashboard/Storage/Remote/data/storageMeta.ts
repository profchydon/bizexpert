import type { BadgeColors } from "@/components/base/badges/badge-types";
import type {
  EntrySource,
  OrderDirection,
  OrderKind,
  RequestKind,
  RequestStatus,
  StorageStatus,
  WipeStatus,
} from "../types/storage";

// Re-exported so the existing consumers across Storage keep importing these from here.
export {
  GRADE_COLOR,
  GRADE_DOT_CLASS,
  GRADE_LABELS,
} from "@/components/application/device-check/gradeMeta";

// An intake row reads as the source the device entered by (Offboarding, Buy to
// Storage, …); every other order keeps its kind label.
export function orderTypeLabel(
  kind: OrderKind,
  entrySource?: EntrySource,
): string {
  return kind === "intake" && entrySource
    ? SOURCE_LABEL[entrySource]
    : ORDER_KIND_LABEL[kind];
}

export const STATUS_LABEL: Record<StorageStatus, string> = {
  pending_check: "Pending Device Check",
  available: "In storage",
  reserved: "Deploying",
  in_transit: "In Transit",
  pending_disposal: "Pending Disposal",
  disposed: "Disposed",
  donated: "Donated",
};

export const STATUS_COLOR: Record<StorageStatus, BadgeColors> = {
  pending_check: "warning",
  available: "success",
  reserved: "brand",
  in_transit: "blue",
  pending_disposal: "warning",
  disposed: "gray",
  donated: "purple",
};

export const SOURCE_LABEL: Record<EntrySource, string> = {
  offboarding: "Offboarding",
  open_fleet: "Open Fleet",
  buy_to_storage: "Buy to Storage",
  repair_return: "Repair Return",
  loaner_return: "Loaner Return",
};

export const SOURCE_COLOR: Record<EntrySource, BadgeColors> = {
  offboarding: "purple",
  open_fleet: "blue",
  buy_to_storage: "indigo",
  repair_return: "gray-blue",
  loaner_return: "orange",
};

export const WIPE_LABEL: Record<WipeStatus, string> = {
  wiped: "Wiped",
  not_wiped: "Not wiped",
  new: "New",
};

export const WIPE_COLOR: Record<WipeStatus, BadgeColors> = {
  wiped: "success",
  not_wiped: "orange",
  new: "blue",
};

export const REQUEST_KIND_LABEL: Record<RequestKind, string> = {
  deployment: "Deployment",
  device_check: "Device check",
  disposal: "Disposal",
  open_fleet_import: "Open Fleet import",
};

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  requested: "Requested",
  in_progress: "In progress",
  completed: "Completed",
  action_required: "Action required",
  cancelled: "Cancelled",
};

export const REQUEST_STATUS_COLOR: Record<RequestStatus, BadgeColors> = {
  requested: "warning",
  in_progress: "brand",
  completed: "success",
  action_required: "error",
  cancelled: "gray",
};

// Order view-model labels: the request kinds plus the synthesized "intake" row.
export const ORDER_KIND_LABEL: Record<OrderKind, string> = {
  ...REQUEST_KIND_LABEL,
  intake: "Entered storage",
};

export const ORDER_KIND_COLOR: Record<OrderKind, BadgeColors> = {
  deployment: "brand",
  device_check: "warning",
  disposal: "error",
  open_fleet_import: "blue",
  intake: "indigo",
};

export const ORDER_DIRECTION_LABEL: Record<OrderDirection, string> = {
  inbound: "In",
  outbound: "Out",
  service: "Service",
};

export const ORDER_DIRECTION_COLOR: Record<OrderDirection, BadgeColors> = {
  inbound: "success",
  outbound: "purple",
  service: "gray-blue",
};
