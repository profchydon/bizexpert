"use client";

import { useMemo } from "react";

import { useGetCatalogPolicyQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicy";

import {
  enrichApprovalRecord,
  getApprovalPolicyAllowItemSwap,
} from "./enrichment";
import type { ApprovalRecord } from "./types";

export function useApprovalDetailEnrichment({
  companyId,
  record,
}: {
  companyId?: string;
  record: ApprovalRecord | null;
}) {
  const shouldFetch = Boolean(companyId && record?.catalogId);
  const policyQuery = useGetCatalogPolicyQuery(
    { companyId: companyId!, catalogId: record?.catalogId! },
    { skip: !shouldFetch },
  );
  const allowItemSwap = getApprovalPolicyAllowItemSwap(
    policyQuery.currentData?.data,
    record?.catalogRuleId,
  );

  return useMemo(
    () =>
      record ? enrichApprovalRecord(record, [], { allowItemSwap }) : record,
    [allowItemSwap, record],
  );
}
