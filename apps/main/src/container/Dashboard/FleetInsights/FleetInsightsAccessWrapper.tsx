"use client";

import PageState from "@/components/PageState";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import { FleetInsightsUpsell } from "./components/FleetInsightsUpsell";

export default function FleetInsightsAccessWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const access = useEntitlementOn("telemetry_agent");

  if (!access.ready) {
    return <PageState isLoading isError={false} />;
  }

  if (!access.on) {
    return <FleetInsightsUpsell />;
  }

  return <>{children}</>;
}
