import type { PlanTier } from "../types";

export const PLAN_ORDER: PlanTier[] = ["procure", "manage", "operate", "scale"];

export const PLAN_LABEL: Record<PlanTier, string> = {
  procure: "Procure",
  manage: "Manage",
  operate: "Operate",
  scale: "Scale",
};

export function nextPlan(plan: PlanTier): PlanTier | null {
  const index = PLAN_ORDER.indexOf(plan);
  return index >= 0 && index < PLAN_ORDER.length - 1
    ? PLAN_ORDER[index + 1]
    : null;
}
