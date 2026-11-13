"use client";

import { Button } from "@/components/base/buttons/button";
import { ProgressBarCircle } from "@/components/base/progress-indicators/progress-circles";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { cn } from "@/lib/utils";
import routes from "@/routes";
import { dashboardCatalogPolicySummary } from "./dashboardCatalogPolicy";
import {
  overviewCardDividerClass,
  overviewCardHeaderRowClass,
  overviewCardShellClass,
} from "./overviewDashboardClasses";
import {
  overviewSectionDescriptionClass,
  overviewSectionHeadingClass,
} from "./overviewTableClasses";
import { PolicyMixDonut } from "./PolicyMixDonut";

function MetricDivider() {
  return (
    <div className="hidden h-24 w-px shrink-0 bg-border-secondary sm:block" />
  );
}

export function CatalogPolicySummaryCard({
  country,
}: Readonly<{
  country?: string;
}>) {
  const dashboardQuery = useWorkspaceDashboardQuery();
  const summary = dashboardCatalogPolicySummary(dashboardQuery.data?.data);
  const subtitle = country
    ? `Rules that govern new hires in ${country}`
    : "Rules that decide what each new hire can order";

  if (!summary.visible) {
    return null;
  }

  return (
    <div className={overviewCardShellClass}>
      <div className={cn(overviewCardHeaderRowClass, "px-6 pt-5 pb-5")}>
        <div className="flex flex-col gap-0.5">
          <p className={overviewSectionHeadingClass}>Catalog policy</p>
          <p className={overviewSectionDescriptionClass}>{subtitle}</p>
        </div>
        <Button
          color="secondary"
          size="md"
          href={routes.CATALOG_POLICIES}
          data-testid="catalogpolicysummarycard-button"
        >
          Manage policy
        </Button>
      </div>
      <div className={overviewCardDividerClass} />
      {dashboardQuery.isLoading ? (
        <div className="h-40 animate-pulse bg-secondary" />
      ) : (
        <div className="flex flex-col items-center gap-8 p-6 sm:flex-row sm:justify-around sm:gap-6">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <ProgressBarCircle
              value={summary.coveredCount}
              min={0}
              max={Math.max(summary.employeeCount, 1)}
              size="xs"
              label="covered"
            />
            <p className="text-sm text-tertiary">
              <span className="font-semibold text-secondary tabular-nums">
                {summary.coveredCount}
              </span>{" "}
              of <span className="tabular-nums">{summary.employeeCount}</span>{" "}
              employees covered
            </p>
          </div>
          <MetricDivider />
          <PolicyMixDonut
            active={summary.activeCount}
            inactive={summary.inactiveCount}
          />
          <MetricDivider />
          <div className="flex shrink-0 flex-col items-center gap-1 text-center">
            <span className="text-display-sm font-semibold text-primary tabular-nums">
              {summary.kitCount}
            </span>
            <span className="text-sm text-tertiary">Kits assigned</span>
          </div>
        </div>
      )}
    </div>
  );
}
