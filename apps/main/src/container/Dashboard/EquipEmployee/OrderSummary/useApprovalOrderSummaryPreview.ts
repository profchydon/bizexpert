"use client";

import { useSearchParams } from "next/navigation";

import { usePreviewApproveCatalogPolicyOrderRequestQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/previewApproveCatalogPolicyOrderRequest";
import { useTaxContext } from "@/hooks/useTaxContext";
import type { IEmployees } from "@/types/employees";
import {
  approvalPreviewEmployeeFees,
  approvalPreviewFees,
  approvalSummaryMeta,
} from "./approvalPreviewFees";

export function useApprovalOrderSummaryPreview({
  companyId,
  employeeId,
  employees,
  paymentMethod,
}: {
  companyId?: string;
  employeeId?: string;
  employees: IEmployees[];
  paymentMethod: "Card" | "Credit";
}) {
  const params = useSearchParams();
  const { mode: taxMode, config } = useTaxContext();
  const { acknowledgeBudgetWarning, catalogId, orderRequestId, returnPath } =
    approvalSummaryMeta(new URLSearchParams(params.toString()), employees);
  const isApprovalOrderSummaryFlow = Boolean(catalogId && orderRequestId);
  const previewQuery = usePreviewApproveCatalogPolicyOrderRequestQuery(
    {
      catalogId: catalogId!,
      companyId: companyId!,
      orderRequestId: orderRequestId!,
      payload: {
        acknowledge_budget_warning: acknowledgeBudgetWarning,
        confirm_proceed_with_unavailable_items: false,
      },
    },
    { skip: !isApprovalOrderSummaryFlow || !companyId },
  );

  return {
    approvalEmployeeFees: approvalPreviewEmployeeFees(
      previewQuery.data,
      paymentMethod,
      employeeId,
    ),
    approvalPaymentRequest:
      catalogId && orderRequestId
        ? { acknowledgeBudgetWarning, catalogId, orderRequestId, returnPath }
        : null,
    ...approvalPreviewFees(previewQuery.data, paymentMethod, taxMode, config),
    isApprovalOrderSummaryFlow,
    isApprovalPreviewError: previewQuery.isError,
    isApprovalPreviewLoading: previewQuery.isLoading || previewQuery.isFetching,
  };
}
