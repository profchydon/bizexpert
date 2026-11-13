"use client";

import { useMemo } from "react";

import { useGetCatalogRulesQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogRules";
import type { CatalogPolicyApiPolicy } from "@/types/catalogPolicy";

import { getPolicyChildRules, getPolicyRules } from "./apiAdapters";
import type { CatalogRule } from "./types";

export function useConfiguringCatalogRules({
  companyId,
  configuringRule,
  policies,
}: {
  companyId?: string;
  configuringRule: CatalogRule | null;
  policies: CatalogPolicyApiPolicy[];
}) {
  const catalogId = configuringRule?.catalogId ?? configuringRule?.id;
  const policy = policies.find((item) => item.id === catalogId);
  const rulesQuery = useGetCatalogRulesQuery(
    {
      companyId: companyId!,
      catalogId: catalogId!,
      params: { per_page: 100, type: "sub" },
    },
    { skip: !companyId || !catalogId },
  );
  const embeddedRules = useMemo(
    () => (policy ? getPolicyChildRules(policy, getPolicyRules(policy)) : []),
    [policy],
  );
  const endpointRules =
    policy && rulesQuery.data
      ? getPolicyChildRules(policy, rulesQuery.data.data.data)
      : undefined;

  return {
    childRules: endpointRules ?? embeddedRules,
    refetch: rulesQuery.refetch,
  };
}
