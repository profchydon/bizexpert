import routes from "@/routes";
import createQueryString from "@/utils/createQueryString";

export const NEW_ONBOARDING_SETUP_ROUTE = "/onboarding/setup";

export const COMPLETED_STAGE = "Completed";

const LEGACY_STAGE_PARAM: Record<string, string> = {
  Verification: "verify",
  "Company Details": "company-profile",
  "Company Information": "company-information",
};

export const NEW_ONBOARDING_STAGE = "Onboarding";

export function isOnboardingIncomplete(stage?: string | null) {
  if (!stage) return false;
  return stage === NEW_ONBOARDING_STAGE || stage in LEGACY_STAGE_PARAM;
}

export function resolveOnboardingRoute(
  stage: string | null | undefined,
  isNewOnboardingEnabled: boolean,
): string | null {
  if (!isOnboardingIncomplete(stage)) return null;

  if (isNewOnboardingEnabled || stage === NEW_ONBOARDING_STAGE) {
    return NEW_ONBOARDING_SETUP_ROUTE;
  }

  return `${routes.LEGACY_ONBOARDING}?${createQueryString(
    "stage",
    LEGACY_STAGE_PARAM[stage as string],
  )}`;
}
