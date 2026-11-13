"use client";

import { useActivateCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/activateCatalogPolicy";
import { useArchiveCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/archiveCatalogPolicy";
import { useCreateCatalogRuleMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/createCatalogRule";
import { useDeleteCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/deleteCatalogPolicy";
import { useDeleteCatalogRuleMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/deleteCatalogRule";
import { useUpdateCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/updateCatalogPolicy";
import { useUpdateCatalogRuleMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/updateCatalogRule";

export function useCatalogRuleDetailMutations() {
  const [updatePolicy, updatePolicyState] = useUpdateCatalogPolicyMutation();
  const [archivePolicy] = useArchiveCatalogPolicyMutation();
  const [deletePolicyMutation, deletePolicyState] =
    useDeleteCatalogPolicyMutation();
  const [activatePolicy, activatePolicyState] =
    useActivateCatalogPolicyMutation();
  const [createRule, createRuleState] = useCreateCatalogRuleMutation();
  const [updateRule, updateRuleState] = useUpdateCatalogRuleMutation();
  const [deleteRule] = useDeleteCatalogRuleMutation();

  return {
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
  };
}
