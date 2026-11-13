import type { PlanTier } from "@/container/Dashboard/Accounts/types";

const TIER_RANK: Record<PlanTier, number> = {
  procure: 0,
  manage: 1,
  operate: 2,
  scale: 3,
};

export function meetsFleetInsightsPlan(tier: PlanTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK.manage;
}
