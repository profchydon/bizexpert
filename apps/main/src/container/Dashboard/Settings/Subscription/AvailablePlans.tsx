"use client";

import type { CatalogPlan, PlanCatalog } from "./catalog";
import { BYOD_NOTE } from "./featureHints";
import { PlanComparisonTable } from "./PlanComparisonTable";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";
import { formatPlanRate } from "./subscriptionMoney";
import {
  baseRate,
  planChangeMode,
  upgradeBlockedWithoutDevices,
  type PlanChangeMode,
} from "./subscriptionView";

export function AvailablePlans({
  catalog,
  current,
  currency,
  devices,
  scheduledSlug,
  onSelect,
}: {
  catalog: PlanCatalog;
  current: CatalogPlan;
  currency: string;
  devices: number;
  scheduledSlug: string | null;
  onSelect: (plan: CatalogPlan, mode: PlanChangeMode) => void;
}) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-primary">Available plans</h2>
        <p className="text-sm text-tertiary">
          Change your plan anytime. Upgrades start today. Downgrades apply from
          your next billing cycle.
        </p>
        <p className="text-xs text-tertiary">{BYOD_NOTE}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-secondary bg-primary">
        <div className="grid grid-cols-1 gap-4 px-4 pt-5 pb-4 sm:grid-cols-2 xl:grid-cols-4">
          {catalog.plans.map((plan) => {
            const amount = baseRate(plan, currency);
            const mode = planChangeMode(current, plan);
            return (
              <SubscriptionPlanCard
                key={plan.slug}
                name={plan.name}
                tagline={plan.tagline}
                highlights={plan.highlights}
                priceLabel={
                  amount === 0 ? "Free" : formatPlanRate(amount, currency)
                }
                priceSuffix={amount === 0 ? "" : "/device/mo"}
                estimateLabel={
                  amount === 0 ? null : plan.estimate?.display || null
                }
                isCurrent={mode === "current"}
                isScheduled={plan.slug === scheduledSlug}
                isPopular={
                  plan.slug === "operate" &&
                  mode !== "current" &&
                  plan.slug !== scheduledSlug
                }
                mode={mode}
                upgradeBlocked={upgradeBlockedWithoutDevices(mode, devices)}
                onSelect={() => onSelect(plan, mode)}
              />
            );
          })}
        </div>
        <PlanComparisonTable catalog={catalog} currency={currency} />
      </div>
    </>
  );
}
