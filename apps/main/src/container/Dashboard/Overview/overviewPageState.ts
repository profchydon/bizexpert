import type { OverviewTier } from "./overviewTier";

export function shouldBlockOverviewOnDashboardError(tier: OverviewTier) {
  return tier === "global" || tier === "office";
}

export function shouldRenderEntityOverview(
  tier: OverviewTier,
  activeEntityId: string | null,
) {
  return tier === "entity" && Boolean(activeEntityId);
}

export function overviewPageIsLoading({
  tier,
  dashboardLoading,
  hasDashboardData,
}: {
  tier: OverviewTier;
  dashboardLoading: boolean;
  hasDashboardData: boolean;
}) {
  if (hasDashboardData) return false;
  if (tier === "entity") return false;
  return dashboardLoading;
}

export function overviewPageIsError({
  tier,
  dashboardError,
}: {
  tier: OverviewTier;
  dashboardError: boolean;
}) {
  return shouldBlockOverviewOnDashboardError(tier) && dashboardError;
}
