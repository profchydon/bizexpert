import { useEffect, useRef } from "react";
import type { IEmployees } from "@/types/employees";
import { trackOffboardingStarted } from "@/lib/offboardAnalytics";
import { buildDeviceLines } from "./offboardPricing";

export function useTrackOffboardingStarted(
  currentId?: string,
  fetchedEmployee?: IEmployees,
  isCurrentEmployee = false,
) {
  const offboardingStartedRef = useRef(false);

  useEffect(() => {
    if (
      offboardingStartedRef.current ||
      !currentId ||
      !isCurrentEmployee ||
      !fetchedEmployee
    ) {
      return;
    }
    const deviceCount = buildDeviceLines(fetchedEmployee.equipment).length;
    if (deviceCount === 0) return;
    offboardingStartedRef.current = true;
    trackOffboardingStarted(currentId, deviceCount);
  }, [currentId, fetchedEmployee, isCurrentEmployee]);
}
