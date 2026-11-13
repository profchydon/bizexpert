import routes from "@/routes";

export const CATALOG_POLICY_UPGRADE_PARAM = "catalogPolicyUpgrade";

export function isCatalogEntitlementRoute(pathname: string): boolean {
  const prefix = routes.CATALOG_POLICIES;
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function catalogPolicyUpgradeHref(
  pathname: string,
  search = "",
  entityId?: string | null,
): string {
  const params = new URLSearchParams(search);
  params.set(CATALOG_POLICY_UPGRADE_PARAM, "1");
  if (entityId && !params.has("entity")) {
    params.set("entity", entityId);
  }
  return `${pathname}?${params.toString()}`;
}

export function catalogPolicyUpgradeReturnHref(
  pathname: string,
  search: string,
): string {
  const params = new URLSearchParams(search);
  params.delete(CATALOG_POLICY_UPGRADE_PARAM);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function catalogPolicyBlockedHref(entityId?: string | null): string {
  return catalogPolicyUpgradeHref(routes.OVERVIEW, "", entityId);
}
