export type CustomerPlan = "enterprise" | "operate" | "basic";

export const PLAN_LABEL: Record<CustomerPlan, string> = {
  enterprise: "Enterprise",
  operate: "Rayda Operate",
  basic: "Basic",
};

/** Enterprise and Operate plans can recover value via buyback before disposal. */
export function planAllowsBuyback(plan: CustomerPlan): boolean {
  return plan === "enterprise" || plan === "operate";
}

/** Mock certified-erasure fee per device (same rate as offboarding erasure). */
export const ERASURE_FEE = 35;
