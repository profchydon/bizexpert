import { useEffect, useRef } from "react";
import { trackOffboardingFeeShown } from "@/lib/offboardAnalytics";
import type { OffboardFeeBreakdown } from "./offboardFeeBreakdown";

export function useTrackOffboardFeeShown(
  breakdown: OffboardFeeBreakdown,
  assetTypeMix: Record<string, number>,
  isLoading: boolean,
) {
  const lastKeyRef = useRef("");

  useEffect(() => {
    if (isLoading) return;
    const key = `${breakdown.total}:${JSON.stringify(assetTypeMix)}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    trackOffboardingFeeShown(breakdown.total, assetTypeMix);
  }, [assetTypeMix, breakdown.total, isLoading]);
}
