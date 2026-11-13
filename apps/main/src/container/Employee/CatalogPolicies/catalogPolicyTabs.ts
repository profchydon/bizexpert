export const catalogPolicyDetailTabs = {
  catalog: "catalog",
  orderRequests: "order-requests",
} as const;

export type CatalogPolicyDetailTab =
  (typeof catalogPolicyDetailTabs)[keyof typeof catalogPolicyDetailTabs];

export function catalogPolicyDetailTabFromParam(
  value: string | null,
): CatalogPolicyDetailTab {
  return value === catalogPolicyDetailTabs.orderRequests
    ? catalogPolicyDetailTabs.orderRequests
    : catalogPolicyDetailTabs.catalog;
}
