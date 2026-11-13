import { resolvePlanTier } from "@/container/Dashboard/Accounts/utils/planTier";
import type { CustomerPlan } from "../data/plans";

export function resolveStorageCustomerPlan(
  plan?: {
    slug?: string | null;
    name?: string | null;
  } | null,
): CustomerPlan {
  const tier = resolvePlanTier(plan?.slug || plan?.name);
  if (tier === "operate") return "operate";
  if (tier === "scale") return "enterprise";
  return "basic";
}
