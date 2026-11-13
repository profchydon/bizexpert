"use client";

import { ZapFast } from "@untitledui/icons";
import { Button } from "@/components/ui/button";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import { dashboardOverviewCards } from "./dashboardOverviewCards";
import { shouldShowSetupBannerForQuery } from "./overviewFeatureRules";

export function SetupBanner() {
  const { data, isSuccess, isError, isLoading } = useWorkspaceDashboardQuery();
  const { push, isPending } = useTransitionRouter();
  const inventory = dashboardOverviewCards(data?.data).total_inventory;

  if (
    !shouldShowSetupBannerForQuery({
      isSuccess,
      isError,
      isLoading,
      inventoryCount: inventory,
    })
  ) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
          <ZapFast className="size-5 text-brand-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Your dashboard is ready. Let&apos;s fill it in.
          </p>
          <p className="text-sm text-brand-600">
            Import your devices to start tracking inventory, assignments, and
            refresh schedules.
          </p>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="primary"
        isLoading={isPending}
        onClick={() => push(routes.ASSET_VAULT)}
        data-testid="setupbanner-button"
      >
        Set up now
      </Button>
    </div>
  );
}
