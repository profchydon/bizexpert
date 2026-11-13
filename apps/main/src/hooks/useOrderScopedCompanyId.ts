"use client";

import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { resolveOrderScopedCompanyId } from "@/utils/workspace/resolveOrderScopedCompanyId";

type OrderCompanyScope = {
  company_id?: string | null;
  subsidiary_id?: string | null;
};

export function useOrderScopedCompanyId(
  order?: OrderCompanyScope | null,
): string | undefined {
  const workspaceCompanyId = useWorkspaceCompanyId();
  return resolveOrderScopedCompanyId(order, workspaceCompanyId);
}
