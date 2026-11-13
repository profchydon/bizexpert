"use client";

import { FEATURE_FLAGS } from "@/config/featureFlags";
import { useFeatureFlag, type FeatureFlagState } from "./useFeatureFlag";

export function useNewOnboardingFlag(): FeatureFlagState {
  return useFeatureFlag(FEATURE_FLAGS.NEW_ONBOARDING, {
    defaultEnabled: true,
  });
}
