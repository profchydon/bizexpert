import type { AppEnv } from "@/config/featureFlags";

export const POSTHOG_SESSION_RECORDING = {
  maskInputOptions: { password: true, tel: true },
  maskTextSelector: "[data-ph-mask]",
} as const;

export type PostHogInitDecision = "init" | "missing-dev" | "missing-prod";

export function resolvePostHogInitDecision(
  key: string | undefined,
  appEnv: AppEnv,
): PostHogInitDecision {
  if (key) {
    return "init";
  }

  return appEnv === "production" ? "missing-prod" : "missing-dev";
}

export const POSTHOG_MISSING_KEY_DEV_MESSAGE =
  "NEXT_PUBLIC_POSTHOG_KEY is not set. PostHog analytics is disabled.";

export const POSTHOG_MISSING_KEY_PROD_MESSAGE =
  "NEXT_PUBLIC_POSTHOG_KEY is not set. Skipping PostHog initialization.";
