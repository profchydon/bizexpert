import { getPendingActionConflictReason } from "./equipmentDisabledReasons";
import {
  getBulkActionDisabledReason,
  isBulkActionEligible,
  isRowTransferEligible,
  normalizeEquipmentStatusKey,
  type BulkEquipmentAction,
} from "./equipmentBulkActionEligibility";

const PENDING_ACTION: Record<
  BulkEquipmentAction,
  "Transfer" | "Store" | "Dispose"
> = {
  transfer: "Transfer",
  store: "Store",
  dispose: "Dispose",
};

export function getTransferActionLabel(status?: string | null) {
  return normalizeEquipmentStatusKey(status) === "assigned"
    ? "Reassign equipment"
    : "Assign equipment";
}

export function getRowActionDisabledState(
  status: string | null | undefined,
  action: BulkEquipmentAction,
  pendingActionType?: string,
) {
  const lifecycleEligible =
    action === "transfer"
      ? isRowTransferEligible(status)
      : isBulkActionEligible(status, action);

  if (!lifecycleEligible) {
    return {
      isDisabled: true,
      reason: getBulkActionDisabledReason([{ status }], action),
    };
  }

  const pendingReason = getPendingActionConflictReason(
    pendingActionType,
    PENDING_ACTION[action],
  );

  return {
    isDisabled: Boolean(pendingReason),
    reason: pendingReason,
  };
}
