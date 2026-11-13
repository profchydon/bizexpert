"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useActivateCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/activateCatalogPolicy";
import { useArchiveCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/archiveCatalogPolicy";
import { useCreateCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/createCatalogPolicy";
import { useCreateCatalogRuleMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/createCatalogRule";
import { useDeleteCatalogRuleMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/deleteCatalogRule";
import { useDeleteCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/deleteCatalogPolicy";
import { useUpdateCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/updateCatalogPolicy";
import { useUpdateCatalogRuleMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/updateCatalogRule";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";

import type { CreatePolicyOptions } from "./components/wizard/AddPolicyWizard.types";
import { submitCreateCatalogPolicy } from "./createPolicySubmit";
import { policyToRule } from "./apiAdapters";
import { useCatalogPolicyList } from "./useCatalogPolicyList";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  ruleToCreateSubRulePayload,
  ruleToSubRulePayload,
} from "./subRulePayload";
import type {
  CatalogRule,
  RuleFilters,
  RuleStatusFilter,
  RuleView,
} from "./types";
import { useConfiguringCatalogRules } from "./useConfiguringCatalogRules";
import { defaultRuleFilters } from "./utils";

export function useCatalogPolicyPageState() {
  const router = useRouter();
  const { getUserDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RuleStatusFilter>("Active");
  const [view, setView] = useState<RuleView>("card");
  const [filters, setFilters] = useState<RuleFilters>(defaultRuleFilters);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [configuringRule, setConfiguringRule] = useState<CatalogRule | null>(
    null,
  );
  const [activatingRule, setActivatingRule] = useState<CatalogRule | null>(
    null,
  );
  const [deletingRule, setDeletingRule] = useState<CatalogRule | null>(null);
  const {
    policiesQuery,
    pagination,
    page: listPage,
  } = useCatalogPolicyList({
    companyId: companyId,
    filters,
    search,
    statusFilter,
  });
  const [createPolicy, createPolicyState] = useCreateCatalogPolicyMutation();
  const [updatePolicy] = useUpdateCatalogPolicyMutation();
  const [archivePolicy] = useArchiveCatalogPolicyMutation();
  const [deletePolicy, deletePolicyState] = useDeleteCatalogPolicyMutation();
  const [activatePolicy, activatePolicyState] =
    useActivateCatalogPolicyMutation();
  const [createRule, createRuleState] = useCreateCatalogRuleMutation();
  const [updateRule, updateRuleState] = useUpdateCatalogRuleMutation();
  const [deleteRule] = useDeleteCatalogRuleMutation();

  const policies = policiesQuery.data?.data.data ?? [];
  const conflictCatalogId =
    policies.find((policy) => !policy.is_archived)?.id ?? policies[0]?.id;
  const configuringRules = useConfiguringCatalogRules({
    companyId: companyId,
    configuringRule,
    policies,
  });
  const rules = useMemo(() => policies.map(policyToRule), [policies]);
  const filtered = rules;
  const notify = (title: string, description?: string) =>
    displaySuccessMessage(title, description);
  async function handleArchive(rule: CatalogRule) {
    if (!companyId || !rule.catalogId) return;
    if (rule.status === "ARCHIVED") {
      await updatePolicy({
        companyId: companyId,
        catalogId: rule.catalogId,
        payload: { is_archived: false },
      }).unwrap();
    } else {
      await archivePolicy({
        companyId: companyId,
        catalogId: rule.catalogId,
      }).unwrap();
    }
    await policiesQuery.refetch();
    notify(
      rule.status === "ARCHIVED" ? "Rule unarchived" : "Rule archived",
      rule.name,
    );
  }

  async function confirmDelete() {
    if (!companyId || !deletingRule?.catalogId) return;
    await deletePolicy({
      companyId: companyId,
      catalogId: deletingRule.catalogId,
    }).unwrap();
    await policiesQuery.refetch();
    notify("Policy deleted", deletingRule.name);
    setDeletingRule(null);
  }
  async function confirmActivate() {
    if (!activatingRule || !companyId || !activatingRule.catalogId) return;
    await activatePolicy({
      companyId: companyId,
      catalogId: activatingRule.catalogId,
    }).unwrap();
    await policiesQuery.refetch();
    notify("Rule activated", `${activatingRule.name} is now live.`);
    setActivatingRule(null);
  }

  async function handleCreate(
    rule: CatalogRule,
    options?: CreatePolicyOptions,
  ) {
    if (!companyId) return;
    await submitCreateCatalogPolicy({
      companyId: companyId,
      createPolicy,
      rule,
      options,
      currentUserId: user?.id,
      notify,
      navigate: (href) => router.push(href),
    });
  }
  async function saveChild(
    rule: CatalogRule,
    options?: { acknowledgeDisplacement?: boolean },
  ) {
    if (!companyId || !configuringRule?.catalogId) return;
    if (rule.backendRuleId) {
      const payload = ruleToSubRulePayload(rule, options);
      await updateRule({
        companyId: companyId,
        catalogId: configuringRule.catalogId,
        ruleId: rule.backendRuleId,
        payload,
      }).unwrap();
    } else {
      const createPayload = ruleToCreateSubRulePayload(rule, options);
      await createRule({
        companyId: companyId,
        catalogId: configuringRule.catalogId,
        payload: createPayload,
      }).unwrap();
    }
    await Promise.all([policiesQuery.refetch(), configuringRules.refetch()]);
    notify("Sub policy saved", rule.name);
  }

  async function removeChild(ruleId: string) {
    if (!companyId || !configuringRule?.catalogId) return;
    await deleteRule({
      companyId: companyId,
      catalogId: configuringRule.catalogId,
      ruleId,
    }).unwrap();
    await Promise.all([policiesQuery.refetch(), configuringRules.refetch()]);
    notify("Sub policy removed");
  }
  return {
    ...{ search, setSearch, statusFilter, setStatusFilter },
    ...{ view, setView, filters, setFilters },
    ...{ companyId: companyId, conflictCatalogId },
    ...{ currentUserId: user?.id },
    ...{ wizardOpen, setWizardOpen, configuringRule, setConfiguringRule },
    ...{ activatingRule, setActivatingRule, deletingRule, setDeletingRule },
    ...{ rules, filtered, configuringChildRules: configuringRules.childRules },
    ...{ pagination, listPage },
    ...{ conflictsMap: new Map() },
    ...{ isLoading: policiesQuery.isLoading },
    ...{ isCreatingPolicy: createPolicyState.isLoading },
    ...{ isActivatingPolicy: activatePolicyState.isLoading },
    ...{ isDeletingPolicy: deletePolicyState.isLoading },
    ...{
      isSavingChild: createRuleState.isLoading || updateRuleState.isLoading,
    },
    ...{ handleArchive, confirmDelete, confirmActivate, handleCreate },
    ...{ saveChild, removeChild },
  };
}
