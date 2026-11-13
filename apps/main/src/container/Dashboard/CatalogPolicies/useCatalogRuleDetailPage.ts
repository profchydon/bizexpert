"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";

import { useGetCatalogPolicyQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicy";
import { useGetCatalogPolicyKitsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyKits";
import { useGetCatalogRulesQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogRules";
import { useGetCatalogRuleImpactedEmployeesQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogRuleImpactedEmployees";
import { useGetCatalogTriggerHistoryQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogTriggerHistory";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useGetAssetCategoriesQuery } from "@/api/baseQueries/assetsApi/getAssetCategories";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  getPolicyChildRules,
  kitToCatalogKit,
  policyToRule,
} from "./apiAdapters";
import { historyToRunEntry, impactedToSelections } from "./apiRowAdapters";
import type { CatalogRule, SelectionLimit } from "./types";
import { getMissingSubRuleKitIds, shouldShowPolicyDetailLoader } from "./utils";
import {
  getSelectionLimitProductCountFallbacks,
  resolveSelectionLimitCategories,
} from "./selectionLimitAdapters";
import {
  hasReviewedSelectionLimits,
  markSelectionLimitsReviewed,
  selectionLimitReviewKey,
} from "./selectionLimitReviewStorage";
import { useDetailActions } from "./useCatalogRuleDetailActions";
import { useCatalogRuleDetailOverlays } from "./useCatalogRuleDetailOverlays";

export function useCatalogRuleDetailPage({
  ruleId,
  openSubRules,
  reviewSelectionLimits,
}: {
  ruleId: string;
  openSubRules: boolean;
  reviewSelectionLimits: boolean;
}) {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const overlays = useCatalogRuleDetailOverlays();
  const [selectionLimits, setSelectionLimits] = useState<SelectionLimit[]>([]);
  const { page: childRulesPage, setPage: setChildRulesPage } =
    useTablePageQuery("rules_page");
  const handledReviewLimits = useRef(false);

  const policyQuery = useGetCatalogPolicyQuery(
    { companyId: companyId!, catalogId: ruleId },
    { skip: !companyId || !ruleId },
  );
  const policy = policyQuery.data?.data;
  const rule = useMemo(
    () => (policy ? policyToRule(policy) : undefined),
    [policy],
  );
  const rulesQuery = useGetCatalogRulesQuery(
    {
      companyId: companyId!,
      catalogId: ruleId,
      params: { per_page: 20, page: childRulesPage, type: "sub" },
    },
    { skip: !companyId || !ruleId },
  );
  const childRules = useMemo(
    () =>
      policy ? getPolicyChildRules(policy, rulesQuery.data?.data.data) : [],
    [policy, rulesQuery.data],
  );
  const missingKitIds = rule ? getMissingSubRuleKitIds(rule, childRules) : [];
  const canActivate = missingKitIds.length === 0;
  const childRulesPagination = {
    currentPage: rulesQuery.data?.data.current_page ?? childRulesPage,
    isLoading: rulesQuery.isFetching,
    lastPage: rulesQuery.data?.data.last_page ?? 1,
    onPageChange: setChildRulesPage,
    total: rulesQuery.data?.data.total ?? 0,
  };

  const impactedQuery = useGetCatalogRuleImpactedEmployeesQuery(
    {
      companyId: companyId!,
      catalogId: rule?.catalogId!,
      ruleId: rule?.backendRuleId!,
      params: { per_page: 20 },
    },
    { skip: !companyId || !rule?.catalogId || !rule.backendRuleId },
  );
  const employeesQuery = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );
  const kitsQuery = useGetCatalogPolicyKitsQuery(
    {
      companyId: companyId!,
      catalogId: rule?.catalogId!,
      params: { per_page: 20 },
    },
    { skip: !companyId || !rule?.catalogId },
  );
  const historyQuery = useGetCatalogTriggerHistoryQuery(
    {
      companyId: companyId!,
      catalogId: rule?.catalogId!,
      params: { per_page: 20 },
    },
    { skip: !companyId || !rule?.catalogId },
  );
  const assetCategoriesQuery = useGetAssetCategoriesQuery();
  const resolvedSelectionLimits = useMemo(
    () =>
      resolveSelectionLimitCategories({
        categories: assetCategoriesQuery.data?.data ?? [],
        limits: selectionLimits,
      }),
    [assetCategoriesQuery.data?.data, selectionLimits],
  );
  const selectionLimitProductCounts = useMemo(
    () => getSelectionLimitProductCountFallbacks(resolvedSelectionLimits),
    [resolvedSelectionLimits],
  );
  const reviewStorageKey = useMemo(
    () => selectionLimitReviewKey(companyId, rule?.catalogId ?? ruleId),
    [companyId, rule?.catalogId, ruleId],
  );
  const dismissSelectionLimitsReview = useCallback(() => {
    markSelectionLimitsReviewed(reviewStorageKey);
  }, [reviewStorageKey]);

  useEffect(() => {
    if (!rule) return;
    setSelectionLimits(rule.selectionLimits ?? []);
  }, [rule]);

  useEffect(() => {
    if (openSubRules && rule) overlays.setters.setConfigureOpen(true);
  }, [openSubRules, rule]);

  useEffect(() => {
    if (!handledReviewLimits.current && reviewSelectionLimits && rule) {
      handledReviewLimits.current = true;
      if (hasReviewedSelectionLimits(reviewStorageKey)) return;
      setSelectionLimits(rule.selectionLimits ?? []);
      overlays.setters.setLimitsOpen(true);
    }
  }, [reviewSelectionLimits, reviewStorageKey, rule]);

  const selections = useMemo(
    () => impactedToSelections(impactedQuery.data?.data.data ?? []),
    [impactedQuery.data],
  );
  const runHistory = useMemo(
    () =>
      (historyQuery.data?.data.data ?? []).map((entry) =>
        historyToRunEntry(entry, employeesQuery.data?.data.data ?? []),
      ),
    [employeesQuery.data, historyQuery.data],
  );
  const catalogKits = useMemo(
    () => (kitsQuery.data?.data.data ?? []).map(kitToCatalogKit),
    [kitsQuery.data],
  );

  const actions = useDetailActions({
    companyId: companyId,
    rule,
    selectionLimits: resolvedSelectionLimits,
    setSelectionLimits,
    onDismissSelectionLimitsReview: dismissSelectionLimitsReview,
    refetch: async () => {
      await Promise.all([policyQuery.refetch(), rulesQuery.refetch()]);
    },
    overlays,
  });

  return {
    companyId: companyId,
    rule,
    childRules,
    childRulesPagination,
    missingKitIds,
    canActivate,
    selections,
    runHistory,
    isRunHistoryLoading: historyQuery.isLoading || historyQuery.isFetching,
    catalogKits,
    selectionLimits: resolvedSelectionLimits,
    selectionLimitProductCounts,
    overlayState: overlays.state,
    actions,
    isLoading: shouldShowPolicyDetailLoader({
      hasCompanyId: Boolean(companyId),
      hasPolicy: Boolean(policy),
      isInitialLoading: policyQuery.isLoading,
    }),
  };
}
