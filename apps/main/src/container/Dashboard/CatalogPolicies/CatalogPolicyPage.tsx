"use client";

import {
  ActivateRuleDialog,
  AddPolicyWizard,
  ConfigureRuleDrawer,
  DeletePolicyDialog,
  PageFrame,
  PolicyPageHeader,
  RuleToolbar,
} from "./components";
import { TableListLocationProvider } from "@/hooks/tableListLocation";
import { PolicyResults } from "./components/rules/PolicyResults";
import { useCatalogPolicyPageState } from "./useCatalogPolicyPageState";

export function CatalogPolicyPage() {
  const state = useCatalogPolicyPageState();

  return (
    <>
      <PageFrame>
        <PolicyPageHeader onAddRule={() => state.setWizardOpen(true)} />
        <RuleToolbar
          search={state.search}
          onSearchChange={state.setSearch}
          statusFilter={state.statusFilter}
          onStatusFilterChange={state.setStatusFilter}
          view={state.view}
          onViewChange={state.setView}
          filters={state.filters}
          onFiltersChange={state.setFilters}
        />
        <TableListLocationProvider page={state.listPage}>
          <PolicyResults
            isLoading={state.isLoading}
            rules={state.rules}
            filtered={state.filtered}
            view={state.view}
            statusFilter={state.statusFilter}
            filters={state.filters}
            search={state.search}
            conflictsMap={state.conflictsMap}
            pagination={state.pagination}
            onArchive={state.handleArchive}
            onActivate={state.setActivatingRule}
            onConfigure={state.setConfiguringRule}
            onDelete={state.setDeletingRule}
            onCreateRule={() => state.setWizardOpen(true)}
            onClearSearch={() => state.setSearch("")}
            onFiltersChange={state.setFilters}
            onStatusFilterChange={state.setStatusFilter}
          />
        </TableListLocationProvider>
      </PageFrame>
      <AddPolicyWizard
        open={state.wizardOpen}
        companyId={state.companyId}
        currentUserId={state.currentUserId}
        conflictCatalogId={state.conflictCatalogId}
        onClose={() => state.setWizardOpen(false)}
        onCreate={state.handleCreate}
        isCreating={state.isCreatingPolicy}
      />
      <ConfigureRuleDrawer
        open={Boolean(state.configuringRule)}
        parent={state.configuringRule}
        childRules={state.configuringChildRules}
        onClose={() => state.setConfiguringRule(null)}
        onSaveChild={state.saveChild}
        onRemoveChild={state.removeChild}
        isSavingChild={state.isSavingChild}
      />
      <ActivateRuleDialog
        open={Boolean(state.activatingRule)}
        onClose={() => state.setActivatingRule(null)}
        onConfirm={state.confirmActivate}
        ruleName={state.activatingRule?.name ?? ""}
        isLoading={state.isActivatingPolicy}
      />
      <DeletePolicyDialog
        open={Boolean(state.deletingRule)}
        policyName={state.deletingRule?.name ?? ""}
        onClose={() => state.setDeletingRule(null)}
        onConfirm={state.confirmDelete}
        isLoading={state.isDeletingPolicy}
      />
    </>
  );
}
