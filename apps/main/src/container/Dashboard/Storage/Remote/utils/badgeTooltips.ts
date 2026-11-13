import type {
  EntrySource,
  OrderDirection,
  OrderKind,
  RequestStatus,
  StorageStatus,
  WipeStatus,
} from "../types/storage";
import type { FreshnessTier } from "./deriveDevice";

// Re-exported so the existing consumers across Storage keep importing this from here.
export { GRADE_TOOLTIP } from "@/components/application/device-check/gradeMeta";

export const STATUS_TOOLTIP: Record<StorageStatus, string> = {
  pending_check:
    "Awaiting a device check. The grade appears once the check is completed.",
  available: "Checked and graded — ready to deploy, check again, or dispose.",
  reserved: "Being deployed to an employee — Rayda is preparing to ship.",
  in_transit:
    "On its way to the employee. Track the shipment for delivery updates.",
  pending_disposal:
    "Disposal in progress — certified erasure and donation are underway.",
  disposed: "Erased and removed from your storage.",
  donated: "Donated through the Rayda Impact Program.",
};

export const SOURCE_TOOLTIP: Record<EntrySource, string> = {
  offboarding: "Returned from a departing employee via Rayda offboarding.",
  open_fleet: "Imported into Rayda storage from your existing inventory.",
  buy_to_storage: "Purchased through Rayda and routed straight to storage.",
  repair_return: "Returned to storage after a completed repair.",
  loaner_return:
    "A temporary loaner device returned to storage by an employee.",
};

export const WIPE_TOOLTIP: Record<WipeStatus, string> = {
  wiped: "Data was erased before this device entered storage.",
  not_wiped:
    "Not wiped before it was moved to storage — it may still hold company data.",
  new: "Bought new straight into storage — never assigned, nothing to wipe.",
};

export function freshnessTooltip(
  tier: FreshnessTier,
  days: number | null,
): string {
  if (tier === "none") return "No device check on record yet.";
  if (tier === "very_stale")
    return `Checked ${days} days ago — we recommend a fresh check before deployment.`;
  if (tier === "stale")
    return `Checked ${days} days ago. Still usable, but a fresh check would refresh the grade.`;
  return `Checked ${days} days ago — grade is current.`;
}

export const REQUEST_STATUS_TOOLTIP: Record<RequestStatus, string> = {
  requested: "Submitted to Rayda — we'll start on it shortly.",
  in_progress: "Rayda is working on this request.",
  completed: "Done — the device record and your inventory are up to date.",
  action_required: "Needs your input before it can proceed.",
  cancelled: "This request was cancelled.",
};

export const ORDER_KIND_TOOLTIP: Record<OrderKind, string> = {
  intake: "Device entered storage from your fleet.",
  open_fleet_import: "A batch import bringing devices into Rayda storage.",
  deployment: "Device leaving storage to be shipped to an employee.",
  device_check: "An inspection to confirm condition and refresh the grade.",
  disposal:
    "Device leaving storage for certified erasure, donation, or destruction.",
};

export const ORDER_DIRECTION_TOOLTIP: Record<OrderDirection, string> = {
  inbound: "Inbound — this device entered storage.",
  outbound: "Outbound — this device is leaving storage.",
  service: "Service — the device stays in storage while Rayda works on it.",
};
