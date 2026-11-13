"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import CatalogAccessWrapper from "@/container/Dashboard/Catalogs/CatalogAccessWrapper";
import { CatalogPolicyUpgradeDialog } from "@/container/Dashboard/Catalogs/CatalogPolicyUpgradeDialog";
import { isCatalogEntitlementRoute } from "@/config/catalogEntitlementRoutes";

export default function SubscriptionRouteGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const guarded = isCatalogEntitlementRoute(pathname);

  return (
    <>
      {guarded ? (
        <CatalogAccessWrapper>{children}</CatalogAccessWrapper>
      ) : (
        children
      )}
      <Suspense fallback={null}>
        <CatalogPolicyUpgradeDialog />
      </Suspense>
    </>
  );
}
