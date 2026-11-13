import type { StoredDevice } from "../types/storage";

// Fixed "now" keeps day math deterministic and SSR-safe (no Date.now() in render).
export const MOCK_NOW = new Date("2026-06-01T00:00:00Z").getTime();

const DAY_MS = 86_400_000;

export function daysBetween(iso: string, now = MOCK_NOW): number {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / DAY_MS));
}

export function daysInStorage(device: StoredDevice): number {
  if (device.daysInStorage != null) return device.daysInStorage;
  return daysBetween(device.entryDate);
}

export function checkAgeDays(device: StoredDevice): number | null {
  if (device.checkedDaysAgo != null) return device.checkedDaysAgo;
  return device.lastCheckDate ? daysBetween(device.lastCheckDate) : null;
}

export type FreshnessTier = "fresh" | "stale" | "very_stale" | "none";

export function freshnessTier(device: StoredDevice): FreshnessTier {
  const age = checkAgeDays(device);
  if (age == null) return "none";
  if (age > 180) return "very_stale";
  if (age > 90) return "stale";
  return "fresh";
}

export function checkFreshnessLabel(device: StoredDevice): string | null {
  if (device.status === "pending_check") return null;
  const days = checkAgeDays(device);
  if (days == null) return null;
  return `Checked ${days}d ago`;
}

const SETTLED: StoredDevice["status"][] = ["disposed", "donated"];

// "Need action" = a device that has sat in storage more than 180 days without a
// check. If it has never been checked, we measure from when it entered storage.
export function needsAction(device: StoredDevice): boolean {
  if (SETTLED.includes(device.status)) return false;
  const daysWithoutCheck = checkAgeDays(device) ?? daysInStorage(device);
  return daysWithoutCheck > 180;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
