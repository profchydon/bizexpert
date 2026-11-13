import type { PlanTier } from "../types";

const OFFICE_LIMIT: Record<PlanTier, number> = {
  procure: 1,
  manage: 5,
  operate: 10,
  scale: Infinity,
};

export function planOfficeLimit(plan: PlanTier): number {
  return OFFICE_LIMIT[plan];
}
