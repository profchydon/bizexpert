"use client";

import { ConfigureRuleDrawer } from "../form/ConfigureRuleDrawer";
import { ActivateRuleDialog, ActivationBlockedDialog } from "./Dialogs";
import { DeletePolicyDialog } from "./DeletePolicyDialog";
import { EditPolicyDrawer } from "./EditPolicyDrawer";
import { KitConfigurationDrawer } from "./KitConfigurationDrawer";
import type { CatalogKit, CatalogRule, RulePagination } from "../../types";

export function RuleDetailOverlays({
  companyId,
  rule,
  childRules,
  childRulesPagination,
  activateOpen,
  activationBlockedOpen,
  editOpen,
  kitConfigOpen,
  configureOpen,
  deleteOpen,
  missingKitIds,
  catalogKits,
  onCloseActivate,
  onCloseActivationBlocked,
  onCloseEdit,
  onCloseKitConfig,
  onCloseConfigure,
  onCloseDelete,
  onConfirmActivate,
  onConfirmDelete,
  onSetUpSubRules,
  onSaveEdit,
  onSaveKit,
  onSaveChild,
  onRemoveChild,
  isActivating = false,
  isDeleting = false,
  isSavingEdit = false,
  isSavingKit = false,
  isSavingChild = false,
}: {
  companyId?: string;
  rule: CatalogRule;
  childRules: CatalogRule[];
  childRulesPagination?: RulePagination;
  activateOpen: boolean;
  activationBlockedOpen: boolean;
  editOpen: boolean;
  kitConfigOpen: boolean;
  configureOpen: boolean;
  deleteOpen: boolean;
  missingKitIds: string[];
  catalogKits: CatalogKit[];
  onCloseActivate: () => void;
  onCloseActivationBlocked: () => void;
  onCloseEdit: () => void;
  onCloseKitConfig: () => void;
  onCloseConfigure: () => void;
  onCloseDelete: () => void;
  onConfirmActivate: () => void;
  onConfirmDelete: () => void;
  onSetUpSubRules: () => void;
  onSaveEdit: (rule: CatalogRule) => Promise<void> | void;
  onSaveKit: (
    rule: CatalogRule,
    options?: { selectionCategoryIds?: string[] },
  ) => Promise<void> | void;
  onSaveChild: (
    rule: CatalogRule,
    options?: { acknowledgeDisplacement?: boolean },
  ) => void;
  onRemoveChild: (ruleId: string) => void;
  isActivating?: boolean;
  isDeleting?: boolean;
  isSavingEdit?: boolean;
  isSavingKit?: boolean;
  isSavingChild?: boolean;
}) {
  return (
    <>
      <ActivateRuleDialog
        open={activateOpen}
        onClose={onCloseActivate}
        onConfirm={onConfirmActivate}
        ruleName={rule.name}
        isLoading={isActivating}
      />
      <DeletePolicyDialog
        open={deleteOpen}
        policyName={rule.name}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
      />
      <ActivationBlockedDialog
        open={activationBlockedOpen}
        missingKitIds={missingKitIds}
        catalogKits={catalogKits}
        onClose={onCloseActivationBlocked}
        onSetUpSubRules={onSetUpSubRules}
      />
      <EditPolicyDrawer
        open={editOpen}
        rule={rule}
        onClose={onCloseEdit}
        onSave={onSaveEdit}
        isSaving={isSavingEdit}
      />
      <KitConfigurationDrawer
        companyId={companyId}
        open={kitConfigOpen}
        rule={rule}
        onClose={onCloseKitConfig}
        onSave={onSaveKit}
        isSaving={isSavingKit}
      />
      <ConfigureRuleDrawer
        open={configureOpen}
        parent={rule}
        childRules={childRules}
        pagination={childRulesPagination}
        onClose={onCloseConfigure}
        onSaveChild={onSaveChild}
        onRemoveChild={onRemoveChild}
        isSavingChild={isSavingChild}
      />
    </>
  );
}
