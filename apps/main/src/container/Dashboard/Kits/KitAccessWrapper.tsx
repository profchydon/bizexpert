"use client";
import { PlanUpgradePrompt } from "@/container/Dashboard/Settings/Subscription/PlanUpgradePrompt";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import routes from "@/routes";
import React from "react";

const KitAccessWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const catalog = useEntitlementOn("catalog_limit");

  if (!catalog.ready) return <div>{children}</div>;
  if (!catalog.on) {
    return (
      <PlanUpgradePrompt
        eyebrow="Kits"
        title="Kits are on Manage and above"
        description="Upgrade to build catalogs and kits for your teams."
        backHref={routes.OVERVIEW}
        backLabel="Back to overview"
      />
    );
  }

  return <div>{children}</div>;
};

export default KitAccessWrapper;
