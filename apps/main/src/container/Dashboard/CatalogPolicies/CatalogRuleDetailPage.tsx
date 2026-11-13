"use client";

import PageState from "@/components/PageState";

import {
  NotFoundState,
  PageFrame,
  RuleConfigCard,
  RuleDetailHeader,
  RunHistorySection,
} from "./components";
import { RuleDetailOverlays } from "./components/overlays/RuleDetailOverlays";
import { SelectionLimitsDrawer } from "./components/wizard/SelectionLimitsDrawer";
import { SelectionLimitsReviewModal } from "./components/wizard/SelectionLimitsReviewModal";
import { useCatalogRuleDetailPage } from "./useCatalogRuleDetailPage";

export function CatalogRuleDetailPage({
  ruleId,
  openSubRules = false,
  reviewSelectionLimits = false,
}: {
  ruleId: string;
  openSubRules?: boolean;
  reviewSelectionLimits?: boolean;
}) {
  const detail = useCatalogRuleDetailPage({
    ruleId,
    openSubRules,
    reviewSelectionLimits,
  });
  const {
    rule,
    childRules,
    missingKitIds,
    canActivate,
    actions,
    overlayState,
  } = detail;

  if (detail.isLoading) {
    return (
      <PageFrame>
        <PageState isLoading isError={false}>
          <div />
        </PageState>
      </PageFrame>
    );
  }

  if (!rule) return <NotFoundState />;
  const currentRule = { ...rule, selectionLimits: detail.selectionLimits };

  return (
    <>
      <PageFrame>
        <RuleDetailHeader
          rule={currentRule}
          canActivate={canActivate}
          onEditRule={() => actions.setEditOpen(true)}
          onEditKitConfig={() => actions.setKitConfigOpen(true)}
          onConfigureSelectionLimits={actions.openSelectionLimitsDrawer}
          onConfigure={() => actions.setConfigureOpen(true)}
          onActivate={actions.handleActivateClick}
          onArchive={actions.toggleArchive}
          onDelete={() => actions.setDeleteOpen(true)}
          isActivating={actions.isActivating}
        />
        <div className="lg:hidden">
          <RuleConfigCard rule={currentRule} childRules={childRules} />
        </div>
        <div className="flex flex-1 gap-6">
          <aside className="hidden w-[340px] shrink-0 lg:block">
            <div className="sticky top-[140px]">
              <RuleConfigCard rule={currentRule} childRules={childRules} />
            </div>
          </aside>
          <section className="flex min-w-0 flex-1 flex-col gap-5">
            {/* {currentRule.selectionMode === "OPEN" ? (
              <EmployeeSelectionsSection
                selections={detail.selections}
                onApprove={actions.approveOne}
                onApproveMany={actions.approveMany}
                onRequestChanges={actions.requestChanges}
              />
            ) : null} */}
            <RunHistorySection
              catalogId={currentRule.catalogId}
              entries={detail.runHistory}
              isLoading={detail.isRunHistoryLoading}
              status={currentRule.status}
              onActivate={actions.handleActivateClick}
            />
          </section>
        </div>
      </PageFrame>
      <RuleDetailOverlays
        companyId={detail.companyId}
        rule={currentRule}
        childRules={childRules}
        childRulesPagination={detail.childRulesPagination}
        activateOpen={overlayState.activateOpen}
        activationBlockedOpen={overlayState.activationBlockedOpen}
        editOpen={overlayState.editOpen}
        kitConfigOpen={overlayState.kitConfigOpen}
        configureOpen={overlayState.configureOpen}
        deleteOpen={overlayState.deleteOpen}
        missingKitIds={missingKitIds}
        catalogKits={detail.catalogKits}
        onCloseActivate={() => actions.setActivateOpen(false)}
        onCloseActivationBlocked={() => actions.setActivationBlockedOpen(false)}
        onCloseEdit={() => actions.setEditOpen(false)}
        onCloseKitConfig={() => actions.setKitConfigOpen(false)}
        onCloseConfigure={() => actions.setConfigureOpen(false)}
        onCloseDelete={() => actions.setDeleteOpen(false)}
        onConfirmActivate={actions.confirmActivate}
        onConfirmDelete={actions.deletePolicy}
        onSetUpSubRules={actions.openSubRulesFromBlocked}
        onSaveEdit={actions.saveEdit}
        onSaveKit={actions.saveKit}
        onSaveChild={actions.saveChild}
        onRemoveChild={actions.removeChild}
        isActivating={actions.isActivating}
        isDeleting={actions.isDeletingPolicy}
        isSavingEdit={actions.isSavingPolicy}
        isSavingKit={actions.isSavingPolicy}
        isSavingChild={actions.isSavingChild}
      />
      <SelectionLimitsReviewModal
        open={overlayState.limitsOpen}
        limits={detail.selectionLimits}
        onClose={() => actions.setLimitsOpen(false)}
        onContinue={() => actions.saveSelectionLimits()}
        onConfigure={actions.openSelectionLimitsDrawer}
      />
      <SelectionLimitsDrawer
        open={overlayState.limitsDrawerOpen}
        limits={detail.selectionLimits}
        productCounts={detail.selectionLimitProductCounts}
        isSaving={actions.isSavingPolicy}
        onClose={() => actions.setLimitsDrawerOpen(false)}
        onSave={actions.saveSelectionLimits}
      />
    </>
  );
}
