import type { IPlan, IPlanPrice } from "@/types/plans";
import formatAmount from "@/utils/formatAmount";

type PlanPrice = IPlanPrice & {
  display?: string;
  currency?: string;
  interval?: string;
};

function splitDevicePrice(display: string) {
  const match = display.match(/^(\$[\d,]+(?:\.\d+)?)(\/.*)$/);
  if (!match) return null;
  return { amount: match[1], suffix: match[2] };
}

export function planPriceLabel(plan?: IPlan) {
  const price = plan?.price as PlanPrice | undefined;
  if (price?.display === "Free") return { amount: "Free", suffix: "" };
  const split = price?.display ? splitDevicePrice(price.display) : null;
  if (split) return split;
  if (price?.display) return { amount: price.display, suffix: "" };

  const amount = Number(price?.amount ?? 0);
  if (!price || amount === 0) return { amount: "Free", suffix: "" };

  const currency = price.currency_code || price.currency || "";
  const cycle = price.billing_cycle || price.interval || "";

  return {
    amount: `${currency} ${formatAmount(amount)}`.trim(),
    suffix: cycle ? `/${String(cycle).toLowerCase()}` : "",
  };
}

export function planRequiresPayment(plan?: IPlan) {
  return planPriceLabel(plan).amount !== "Free";
}

export function findPlanBySlug(plans: IPlan[], slug: string) {
  return plans.find((plan) => plan.slug === slug);
}

export function findFreePlan(plans: IPlan[]) {
  return plans.find((plan) => Number(plan.price?.amount ?? 0) === 0);
}
