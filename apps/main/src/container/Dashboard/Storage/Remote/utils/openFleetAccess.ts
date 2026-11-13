import type { PlanTier } from "@/container/Dashboard/Accounts/types";

const TIER_RANK: Record<PlanTier, number> = {
  procure: 0,
  manage: 1,
  operate: 2,
  scale: 3,
};

export const OPEN_FLEET_UPGRADE_REASON = "Open Fleet is on Manage and above";
export const OPEN_FLEET_COMING_SOON_REASON = "Coming soon";

export function canUseOpenFleet(tier: PlanTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK.manage;
}

export function openFleetImportDisabledReason(tier: PlanTier): string {
  return canUseOpenFleet(tier)
    ? OPEN_FLEET_COMING_SOON_REASON
    : OPEN_FLEET_UPGRADE_REASON;
}
