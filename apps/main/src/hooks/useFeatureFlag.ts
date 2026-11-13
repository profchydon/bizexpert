"use client";

import { useEffect, useState } from "react";
import { useActiveFeatureFlags, useFeatureFlagEnabled } from "posthog-js/react";

const FLAG_RESOLUTION_TIMEOUT_MS = 4000;

export interface FeatureFlagState {
  enabled: boolean;
  resolved: boolean;
}

export interface FeatureFlagOptions {
  defaultEnabled?: boolean;
}

export function useFeatureFlag(
  flag: string,
  options?: FeatureFlagOptions,
): FeatureFlagState {
  const value = useFeatureFlagEnabled(flag);
  const activeFlags = useActiveFeatureFlags();
  const [timedOut, setTimedOut] = useState(false);
  const defaultEnabled = options?.defaultEnabled ?? false;

  const flagsLoaded = activeFlags !== undefined || value !== undefined;

  useEffect(() => {
    if (flagsLoaded) return;
    const timer = setTimeout(
      () => setTimedOut(true),
      FLAG_RESOLUTION_TIMEOUT_MS,
    );
    return () => clearTimeout(timer);
  }, [flagsLoaded]);

  return {
    enabled: defaultEnabled ? value !== false : value === true,
    resolved: flagsLoaded || timedOut,
  };
}
