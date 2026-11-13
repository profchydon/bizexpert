"use client";

import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import routes from "@/routes";

import { ruleToPolicyPayload } from "./apiAdapters";
import {
  ruleToCreateSubRulePayload,
  ruleToSubRulePayload,
} from "./subRulePayload";
import type { CatalogRule, SelectionLimit } from "./types";
import type { useCatalogRuleDetailOverlays } from "./useCatalogRuleDetailOverlays";
import { useCatalogRuleDetailMutations } from "./useCatalogRuleDetailMutations";
import { useSelectionLimitActions } from "./useSelectionLimitActions";

type Args = {
  companyId?: string;
  rule?: CatalogRule;
  selectionLimits: SelectionLimit[];
  setSelectionLimits: Dispatch<SetStateAction<SelectionLimit[]>>;
  onDismissSelectionLimitsReview?: () => void;
  refetch: () => Promise<unknown>;
  overlays: ReturnType<typeof useCatalogRuleDetailOverlays>;
};
type SavePolicyOptions = { selectionCategoryIds?: string[] };

export function useDetailActions({
  companyId,
  rule,
  selectionLimits,
  setSelectionLimits,
  onDismissSelectionLimitsReview,
  refetch,
  overlays,
}: Args) {
  const router = useRouter();
  const {
    activatePolicy,
    activatePolicyState,
    archivePolicy,
    createRule,
    createRuleState,
    deletePolicyMutation,
    deletePolicyState,
    deleteRule,
    updatePolicy,
    updatePolicyState,
    updateRule,
    updateRuleState,
  } = useCatalogRuleDetailMutations();

  const canWrite = Boolean(companyId && rule?.catalogId);

  async function refreshAndToast(title: string, description?: string) {
    await refetch();
    displaySuccessMessage(title, description);
  }

  async function savePolicy(updates: CatalogRule, options?: SavePolicyOptions) {
    if (!companyId || !updates.catalogId) return;
    const payload = ruleToPolicyPayload(updates, options);
    await updatePolicy({
      companyId,
      catalogId: updates.catalogId,
      payload,
    }).unwrap();
    await refreshAndToast("Policy saved", updates.name);
  }

  const selectionLimitActions = useSelectionLimitActions({
    onDismissSelectionLimitsReview,
    overlays,
    rule,
    savePolicy,
    selectionLimits,
    setSelectionLimits,
  });

  return {
    saveEdit: async (updates: CatalogRule) => {
      await savePolicy(updates);
      overlays.setters.setEditOpen(false);
    },
    saveKit: async (updates: CatalogRule, options?: SavePolicyOptions) => {
      await savePolicy(updates, options);
      overlays.setters.setKitConfigOpen(false);
    },
    saveChild: async (
      child: CatalogRule,
      options?: { acknowledgeDisplacement?: boolean },
    ) => {
      if (!companyId || !rule?.catalogId) return;
      if (child.backendRuleId) {
        const payload = ruleToSubRulePayload(child, options);
        await updateRule({
          companyId,
          catalogId: rule.catalogId,
          ruleId: child.backendRuleId,
          payload,
        }).unwrap();
      } else {
        const createPayload = ruleToCreateSubRulePayload(child, options);
        await createRule({
          companyId,
          catalogId: rule.catalogId,
          payload: createPayload,
        }).unwrap();
      }
      await refreshAndToast("Sub policy saved", child.name);
    },
    removeChild: async (id: string) => {
      if (!companyId || !rule?.catalogId) return;
      await deleteRule({
        companyId,
        catalogId: rule.catalogId,
        ruleId: id,
      }).unwrap();
      await refreshAndToast("Sub policy removed");
    },
    confirmActivate: async () => {
      if (
        !canWrite ||
        !companyId ||
        !rule?.catalogId ||
        activatePolicyState.isLoading
      ) {
        return;
      }
      await activatePolicy({ companyId, catalogId: rule.catalogId }).unwrap();
      overlays.setters.setActivateOpen(false);
      await refreshAndToast("Rule activated", `${rule.name} is now live.`);
    },
    handleActivateClick: () => {
      if (activatePolicyState.isLoading) return;
      overlays.setters.setActivateOpen(true);
    },
    openSubRulesFromBlocked: () => {
      overlays.setters.setActivationBlockedOpen(false);
      overlays.setters.setConfigureOpen(true);
    },
    toggleArchive: async () => {
      if (!canWrite || !companyId || !rule?.catalogId) return;
      if (rule.status === "ARCHIVED") {
        await updatePolicy({
          companyId,
          catalogId: rule.catalogId,
          payload: { is_archived: false },
        }).unwrap();
      } else {
        await archivePolicy({ companyId, catalogId: rule.catalogId }).unwrap();
      }
      await refreshAndToast(
        rule.status === "ARCHIVED" ? "Rule unarchived" : "Rule archived",
        rule.name,
      );
    },
    deletePolicy: async () => {
      if (!canWrite || !companyId || !rule?.catalogId) return;
      const ruleName = rule.name;
      const catalogId = rule.catalogId;
      router.replace(routes.CATALOG_POLICIES);
      await deletePolicyMutation({
        companyId,
        catalogId,
      }).unwrap();
      displaySuccessMessage("Policy deleted", ruleName);
    },
    ...selectionLimitActions,
    approveOne: () =>
      displayErrorMessage("Selection approval endpoint unavailable"),
    approveMany: () =>
      displayErrorMessage("Selection approval endpoint unavailable"),
    requestChanges: () =>
      displayErrorMessage("Selection change endpoint unavailable"),
    isActivating: activatePolicyState.isLoading,
    isDeletingPolicy: deletePolicyState.isLoading,
    isSavingPolicy: updatePolicyState.isLoading,
    isSavingChild: createRuleState.isLoading || updateRuleState.isLoading,
    ...overlays.setters,
  };
}
