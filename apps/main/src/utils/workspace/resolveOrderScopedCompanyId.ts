type OrderCompanyScope = {
  company_id?: string | null;
  subsidiary_id?: string | null;
};

export function resolveOrderScopedCompanyId(
  order: OrderCompanyScope | null | undefined,
  workspaceCompanyId: string | undefined,
): string | undefined {
  const orderCompanyId =
    order?.company_id?.trim() || order?.subsidiary_id?.trim();
  if (orderCompanyId) return orderCompanyId;
  return workspaceCompanyId;
}
