"use client";

import { PlanUpgradePrompt } from "@/container/Dashboard/Settings/Subscription/PlanUpgradePrompt";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolvePlanTier } from "@/container/Dashboard/Accounts/utils/planTier";
import routes from "@/routes";
import { canUseOpenFleet } from "./utils/openFleetAccess";

export default function OpenFleetAccessWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const tier = resolvePlanTier(
    company?.subscription?.plan?.slug || company?.subscription?.plan?.name,
  );

  if (!canUseOpenFleet(tier)) {
    return (
      <PlanUpgradePrompt
        eyebrow="Open Fleet"
        title="Open Fleet is on Manage and above"
        description="Upgrade to import existing inventory into Rayda storage."
        backHref={routes.STORAGE}
        backLabel="Back to storage"
      />
    );
  }

  return <>{children}</>;
}
