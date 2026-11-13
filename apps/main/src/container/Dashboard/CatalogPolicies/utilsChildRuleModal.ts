export function getChildRuleSubmitLabel({
  finalStep,
  isEditing = false,
  isSaving,
}: {
  finalStep: boolean;
  isEditing?: boolean;
  isSaving: boolean;
}) {
  if (isSaving) return isEditing ? "Updating..." : "Adding...";
  if (!finalStep) return "Next";
  return isEditing ? "Update sub policy" : "Add sub policy";
}

export function isChildRuleSubmitDisabled({
  canSave,
  canContinue,
  finalStep,
  isSaving,
}: {
  canSave: boolean;
  canContinue?: boolean;
  finalStep: boolean;
  isSaving: boolean;
}) {
  return isSaving || (finalStep ? !canSave : !canContinue);
}

export function shouldShowChildRuleCategoryLimits({
  selectionMode,
  overrideKit,
  kitIds,
}: {
  selectionMode: "FIXED" | "OPEN";
  overrideKit: boolean;
  kitIds: string[];
}) {
  return selectionMode === "OPEN" && overrideKit && kitIds.length > 0;
}
