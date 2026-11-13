import { canPerformAction } from "./util";
import { removeUserscore } from "@/utils/underScoreTransformer";

export type BulkEquipmentAction = "transfer" | "store" | "dispose";

export function normalizeEquipmentStatusKey(status?: string | null) {
  return (status ?? "").trim().toLowerCase().replace(/\s+/g, "_");
}

export function formatEquipmentStatusLabel(status?: string | null) {
  const key = normalizeEquipmentStatusKey(status);
  if (!key) return "Unknown";

  return removeUserscore(key)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function isBulkTransferEligible(status?: string | null) {
  return normalizeEquipmentStatusKey(status) === "assigned";
}

export function isRowTransferEligible(status?: string | null) {
  return canPerformAction(normalizeEquipmentStatusKey(status), "transfer");
}

export function isBulkStoreEligible(status?: string | null) {
  return normalizeEquipmentStatusKey(status) === "assigned";
}

export function isBulkDisposeEligible(status?: string | null) {
  return canPerformAction(normalizeEquipmentStatusKey(status), "dispose");
}

export function isBulkActionEligible(
  status: string | null | undefined,
  action: BulkEquipmentAction,
) {
  if (action === "transfer") return isBulkTransferEligible(status);
  if (action === "store") return isBulkStoreEligible(status);
  return isBulkDisposeEligible(status);
}

const ACTION_LABEL: Record<BulkEquipmentAction, string> = {
  transfer: "Reassign",
  store: "Store",
  dispose: "Dispose",
};

const STATUS_REASONS: Partial<
  Record<string, Partial<Record<BulkEquipmentAction, string>>>
> = {
  in_storage: {
    transfer: "Reassign isn't available while equipment is in storage.",
    store:
      "Store isn't available because the selected equipment is already in storage.",
  },
  sold: {
    transfer: "Reassign isn't available for sold equipment.",
    store: "Store isn't available for sold equipment.",
  },
  in_transit: {
    transfer: "Reassign isn't available while equipment is in transit.",
    store: "Store isn't available while equipment is in transit.",
  },
  pending_pickup: {
    transfer: "Reassign isn't available while a pickup is pending.",
    store: "Store isn't available while a pickup is pending.",
  },
  under_repair: {
    transfer: "Reassign isn't available while equipment is under repair.",
    store: "Store isn't available while equipment is under repair.",
  },
  faulty: {
    transfer: "Reassign isn't available for faulty equipment.",
    store: "Store isn't available for faulty equipment.",
  },
  archived: {
    transfer: "Reassign isn't available for archived equipment.",
    store: "Store isn't available for archived equipment.",
  },
  awaiting_assignment: {
    transfer:
      "Reassign isn't available while equipment is awaiting assignment.",
    store: "Store isn't available while equipment is awaiting assignment.",
  },
  unassigned: {
    transfer: "Reassign isn't available for unassigned equipment.",
    store: "Store isn't available for unassigned equipment.",
  },
  request_sale: {
    transfer: "Reassign isn't available while a sale has been requested.",
    store: "Store isn't available while a sale has been requested.",
  },
  request_storage: {
    transfer: "Reassign isn't available while storage has been requested.",
    store: "Store isn't available while storage has been requested.",
  },
  leased: {
    transfer: "Reassign isn't available for leased equipment.",
    store: "Store isn't available for leased equipment.",
  },
};

function getSingleStatusReason(statusKey: string, action: BulkEquipmentAction) {
  return STATUS_REASONS[statusKey]?.[action] ?? null;
}

export function getBulkActionDisabledReason(
  selectedRows: Array<{ status?: string | null }>,
  action: BulkEquipmentAction,
) {
  const ineligible = selectedRows.filter(
    (row) => !isBulkActionEligible(row.status, action),
  );
  if (ineligible.length === 0) return null;

  const blockingKeys = [
    ...new Set(
      ineligible.map((row) => normalizeEquipmentStatusKey(row.status)),
    ),
  ].filter(Boolean);

  if (blockingKeys.length === 1) {
    const specific = getSingleStatusReason(blockingKeys[0], action);
    if (specific) return specific;
  }

  const actionLabel = ACTION_LABEL[action];
  const statusLabels = blockingKeys.map(formatEquipmentStatusLabel).join(", ");

  if (statusLabels) {
    return `${actionLabel} isn't available for equipment with status: ${statusLabels}.`;
  }

  return `${actionLabel} isn't available for one or more selected items in their current status.`;
}
