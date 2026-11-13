import { removeUserscore } from "@/utils/underScoreTransformer";

export { getBulkActionDisabledReason } from "./equipmentBulkActionEligibility";

export function getSeeActionsDisabledReason(count: number) {
  if (count > 0) return null;
  return "There are no pending offboarding actions to review.";
}

export function getPendingActionConflictReason(
  matchedActionType: string | undefined,
  requestedAction: "Transfer" | "Store" | "Dispose" | "Sale",
) {
  if (!matchedActionType || matchedActionType === requestedAction) {
    return null;
  }

  return `This equipment already has a pending ${removeUserscore(matchedActionType).toLowerCase()} action.`;
}

export function getEquipmentNavigationDisabledReason(
  direction: "prev" | "next",
  hasTarget: boolean,
  isResolving: boolean,
) {
  if (isResolving) return "Loading adjacent equipment.";
  if (hasTarget) return null;
  return direction === "prev"
    ? "There is no previous equipment in this list."
    : "There is no next equipment in this list.";
}

export function getAssetVaultTabDisabledReason(isPending: boolean) {
  if (!isPending) return null;
  return "Switching tabs. Please wait.";
}

export function getSpecTypeDisabledReason(
  option: string,
  fieldName: string,
  usedNames: string[],
) {
  if (!usedNames.includes(option) || option === fieldName) return null;
  return "This specification type is already used.";
}

export function getExportFilterDisabledReason(isDisabled: boolean) {
  if (!isDisabled) return null;
  return "Select at least one filter to export data.";
}

export function getApplyingFiltersDisabledReason(isApplying: boolean) {
  if (!isApplying) return null;
  return "Applying filters. Please wait.";
}
