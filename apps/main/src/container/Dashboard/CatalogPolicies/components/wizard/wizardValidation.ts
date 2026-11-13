import type { CatalogRule } from "../../types";

export function canContinuePolicyWizard({
  draft,
  hasRequiredApprovers,
  step,
}: {
  draft: CatalogRule;
  hasRequiredApprovers: boolean;
  step: number;
}) {
  if (step === 1) return draft.name.trim().length > 0;
  if (step !== 3) return true;
  return (
    draft.kitIds.length > 0 &&
    hasRequiredOpenPolicyBudget(draft) &&
    draft.requiresApproval !== undefined &&
    hasRequiredApprovers
  );
}

export function hasRequiredOpenPolicyBudget(draft: CatalogRule) {
  if (draft.selectionMode !== "OPEN") return true;
  return (
    typeof draft.budget === "number" &&
    Number.isFinite(draft.budget) &&
    draft.budget > 0
  );
}

export function getPolicyWizardHint({
  baseCanProceed,
  draft,
  hasRequiredApprovers,
  isConflictBlocked,
  isCheckingConflicts,
  requiresConflictAcknowledgment,
  step,
}: {
  baseCanProceed: boolean;
  draft: CatalogRule;
  hasRequiredApprovers: boolean;
  isConflictBlocked: boolean;
  isCheckingConflicts: boolean;
  requiresConflictAcknowledgment?: boolean;
  step: number;
}) {
  if (step === 1 && !baseCanProceed) {
    return "Give your policy a name to continue.";
  }
  if (step !== 3) return undefined;
  if (draft.kitIds.length === 0)
    return "Choose a kit before creating the policy.";
  if (!hasRequiredOpenPolicyBudget(draft)) {
    return "Enter a budget per employee before creating an open policy.";
  }
  if (draft.requiresApproval === undefined) {
    return "Select an approval type to continue.";
  }
  if (!hasRequiredApprovers) {
    return "Unable to identify the admin approver for this policy.";
  }
  if (isCheckingConflicts) return "Checking policy conflicts...";
  if (isConflictBlocked) {
    return requiresConflictAcknowledgment
      ? "Acknowledge the conflict before creating the policy."
      : "Resolve the conflicting policy before creating this policy.";
  }
  return undefined;
}
