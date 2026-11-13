"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AssetDetailUpgradeDialog } from "@/container/Dashboard/AllEquipments/AssetDetailUpgradeDialog";
import {
  CATALOG_POLICY_UPGRADE_PARAM,
  catalogPolicyUpgradeReturnHref,
} from "@/config/catalogEntitlementRoutes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

export function CatalogPolicyUpgradeDialog() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useTransitionRouter();
  const open = searchParams.get(CATALOG_POLICY_UPGRADE_PARAM) === "1";

  return (
    <AssetDetailUpgradeDialog
      open={open}
      onClose={() =>
        replace(
          catalogPolicyUpgradeReturnHref(pathname, searchParams.toString()),
        )
      }
      title="Catalog Policy is on Manage and above"
      description="Upgrade to open Catalog Policy for your teams."
    />
  );
}
