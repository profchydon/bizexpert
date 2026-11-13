import type { PlanSlug } from "@/types/onboarding";

export const ONBOARDING_CHECKOUT_PATH = "/onboarding/complete";

export function buildOnboardingCheckout(companyId: string, planId: string) {
  if (!companyId || !planId) return null;

  return {
    companyId,
    planId,
    redirectUrl: ONBOARDING_CHECKOUT_PATH,
  };
}

export function buildPlanSelectionPayload(
  companyId: string,
  selectedPlan: string,
) {
  return { companyId, plan_slug: selectedPlan as PlanSlug };
}
