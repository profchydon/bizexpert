import { useMemo } from "react";
import {
  buildDispositionMixFromActionTypes,
  trackOffboardingConfirmed,
} from "@/lib/offboardAnalytics";
import { extractOrderIdFromResponse } from "@/lib/orderFlowAnalytics";
import { extractAggregateOffboardFeeBreakdown } from "@/container/Dashboard/Employees/OffboardDevices/offboardFeeBreakdown";
import { useTrackOffboardFeeShown } from "@/container/Dashboard/Employees/OffboardDevices/useTrackOffboardFeeShown";
import type { Offboard_asset } from "@/types/offboarding";
import type { TaxDisplayMode } from "@/types/tax";

export function useOffboardingOrderSummaryAnalytics({
  actionsDB,
  calculateOffboardingFeesData,
  isLoadingFees,
  taxMode,
  transformTogetFees,
}: {
  actionsDB: Offboard_asset[];
  calculateOffboardingFeesData: Record<string, any> | undefined;
  isLoadingFees: boolean;
  taxMode: TaxDisplayMode;
  transformTogetFees: Record<string, unknown>;
}) {
  const breakdown = useMemo(
    () =>
      extractAggregateOffboardFeeBreakdown(
        calculateOffboardingFeesData,
        actionsDB.length,
        taxMode,
      ),
    [actionsDB.length, calculateOffboardingFeesData, taxMode],
  );

  useTrackOffboardFeeShown(
    breakdown,
    {},
    isLoadingFees || !calculateOffboardingFeesData,
  );

  return {
    trackConfirmed: (result: unknown) => {
      trackOffboardingConfirmed({
        order_id: extractOrderIdFromResponse(result),
        device_count: actionsDB.length,
        disposition_mix: buildDispositionMixFromActionTypes(
          actionsDB.map((item) => item.actionType),
        ),
        total_fee: Number(
          calculateOffboardingFeesData?.fee_summary?.total_fee ?? 0,
        ),
      });
    },
  };
}
