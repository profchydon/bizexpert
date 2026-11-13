import type { PlanTier } from "../types";

export function planSupportsCredit(plan: PlanTier): boolean {
  return plan !== "procure";
}
