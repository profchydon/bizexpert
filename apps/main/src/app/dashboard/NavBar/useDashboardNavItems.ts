"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useDashboardPermissions } from "@/hooks/useDashboardPermissions";
import { isBizExpertApp } from "@/config/product";
import { bizexpertNavItems } from "./bizexpertNavItems";
import { items } from "./NavItems.data";

export function useDashboardNavItems() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeEntityId } = useActiveWorkspace();
  const permissions = useDashboardPermissions();
  const catalog = useEntitlementOn("catalog_limit");

  if (isBizExpertApp()) {
    return bizexpertNavItems(pathname);
  }

  return items(pathname, permissions, activeEntityId ?? null, {
    search: searchParams.toString(),
    catalogPolicyOn: catalog.ready ? catalog.on : undefined,
  });
}
