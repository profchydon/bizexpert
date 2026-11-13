import type { PlanTier } from "../types";

export function resolvePlanTier(planName?: string | null): PlanTier {
  if (!planName?.trim()) return "scale";
  const normalized = planName.toLowerCase();
  if (normalized.includes("scale")) return "scale";
  if (normalized.includes("operate")) return "operate";
  if (normalized.includes("manage")) return "manage";
  return "procure";
}

interface PlanLabel {
  slug?: string | null;
  name?: string | null;
}

export function resolveAccountsPlanTier(
  contractPlan?: PlanLabel | null,
  legacyPlan?: PlanLabel | null,
): PlanTier {
  const plan = contractPlan ?? legacyPlan;
  return resolvePlanTier(plan?.slug || plan?.name);
}

export function showScalePlanNotice(plan: {
  ready: boolean;
  tier: PlanTier;
}): boolean {
  return plan.ready && plan.tier !== "scale";
}
