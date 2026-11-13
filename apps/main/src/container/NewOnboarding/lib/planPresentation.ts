import type { PlanSlug } from "@/types/onboarding";
import type { IPlan } from "@/types/plans";
import { findFreePlan, planPriceLabel } from "./planPricing";

export const SELECTABLE_PLAN_SLUGS: PlanSlug[] = [
  "procure",
  "manage",
  "operate",
  "scale",
];

export function selectablePlans(plans: IPlan[]): IPlan[] {
  return plans.filter((plan) =>
    SELECTABLE_PLAN_SLUGS.includes(plan.slug as PlanSlug),
  );
}

export interface PlanColumn {
  slug: string;
  label: string;
}

export interface PlanFeatureRow {
  name: string;
  includedIn: Record<string, boolean>;
}

export function planColumns(plans: IPlan[]): PlanColumn[] {
  return plans.map((plan) => {
    const price = planPriceLabel(plan);
    return {
      slug: plan.slug,
      label: `${plan.name} (${price.amount}${price.suffix})`,
    };
  });
}

export function planFeatureMatrix(plans: IPlan[]): PlanFeatureRow[] {
  const names: string[] = [];

  plans.forEach((plan) =>
    (plan.features ?? []).forEach((feature) => {
      if (feature?.name && !names.includes(feature.name)) {
        names.push(feature.name);
      }
    }),
  );

  return names.map((name) => ({
    name,
    includedIn: Object.fromEntries(
      plans.map((plan) => [
        plan.slug,
        (plan.features ?? []).some((feature) => feature?.name === name),
      ]),
    ),
  }));
}

export function billingSummary(plans: IPlan[]): string {
  const cycles = Array.from(
    new Set(
      plans
        .map((plan) => String(plan.price?.billing_cycle ?? "").toLowerCase())
        .filter(Boolean),
    ),
  );
  const freePlan = findFreePlan(plans);
  const sentences: string[] = [];

  if (cycles.length === 1) {
    sentences.push(`All prices are billed ${cycles[0]}.`);
  }
  if (freePlan) {
    sentences.push(`Start free on ${freePlan.name}.`);
  }

  return sentences.join(" ");
}
