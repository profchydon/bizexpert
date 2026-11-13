import type { ApproveOrderRequestArgs } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/types";
import type { ApprovalActionOptions, ApprovalRecord } from "./types";
import { approveOrderRequestPayload } from "./utils";

export function buildApproveOrderRequestArgs({
  companyId,
  id,
  options,
  record,
}: {
  companyId?: string;
  id: string;
  options?: ApprovalActionOptions;
  record?: ApprovalRecord | null;
}): ApproveOrderRequestArgs | null {
  if (!companyId || !record?.catalogId) return null;

  return {
    catalogId: record.catalogId,
    companyId,
    orderRequestId: id,
    payload: approveOrderRequestPayload(options),
  };
}
