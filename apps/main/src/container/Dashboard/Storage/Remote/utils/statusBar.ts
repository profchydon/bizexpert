import type { StorageStatus, StoredDevice } from "../types/storage";

/** Solid utility-token background classes for stacked-bar segments and legend dots. */
export const STATUS_BAR_CLASS: Record<StorageStatus, string> = {
  available: "bg-utility-success-500",
  pending_check: "bg-utility-warning-500",
  reserved: "bg-utility-brand-500",
  in_transit: "bg-utility-blue-500",
  pending_disposal: "bg-utility-orange-500",
  disposed: "bg-utility-gray-500",
  donated: "bg-utility-purple-500",
};

/** Order segments by lifecycle so the bar reads left-to-right. */
export const STATUS_BAR_ORDER: StorageStatus[] = [
  "available",
  "pending_check",
  "reserved",
  "in_transit",
  "pending_disposal",
  "disposed",
  "donated",
];

export function countByStatus(
  devices: StoredDevice[],
): Record<StorageStatus, number> {
  const counts = {
    available: 0,
    pending_check: 0,
    reserved: 0,
    in_transit: 0,
    pending_disposal: 0,
    disposed: 0,
    donated: 0,
  } as Record<StorageStatus, number>;
  for (const d of devices) counts[d.status] += 1;
  return counts;
}
