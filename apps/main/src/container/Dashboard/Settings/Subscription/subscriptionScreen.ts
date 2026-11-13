import type { SubscriptionContract } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import type { PlanCatalog } from "./catalog";
import { planOnScreen } from "./endedPlanCopy";
import { pageNotice } from "./subscriptionNotices";
import {
  billingCurrency,
  currentPlanSlug,
  fleetCount,
  formatBillingDate,
  renewalInstance,
  upgradeBlockedWithoutDevices,
} from "./subscriptionView";

export function subscriptionScreen(
  contract: SubscriptionContract | undefined,
  catalog: PlanCatalog,
) {
  const current = catalog.plans.find(
    (plan) => plan.slug === currentPlanSlug(contract, catalog.plans),
  );
  const freePlan = catalog.plans.find((plan) => plan.amount === 0);
  const lapsed = renewalInstance(contract?.status) === "lapsed";
  const shown = planOnScreen(lapsed, current, freePlan);
  const devices = fleetCount(catalog.plans);
  const settleBy = formatBillingDate(contract?.period?.end);
  const scheduled = contract?.scheduled_change ?? null;
  const expired = contract?.expired_from?.plan ?? null;
  const resubscribe =
    catalog.plans.find((plan) => plan.slug === expired?.slug?.toLowerCase()) ??
    (lapsed && current && current.amount > 0 ? current : undefined);
  return {
    current,
    shown,
    freePlan,
    lapsed,
    currency: billingCurrency(contract, current),
    devices,
    settleBy,
    scheduled,
    resubscribe,
    upgradeBlocked: upgradeBlockedWithoutDevices("upgrade", devices),
    notice: pageNotice({
      status: contract?.status,
      planName: current?.name ?? "your",
      periodEnd: settleBy,
      freePlanName:
        lapsed && freePlan && freePlan.slug !== current?.slug
          ? freePlan.name
          : "",
      expiredFrom: expired?.name
        ? {
            planName: expired.name,
            endedOn: formatBillingDate(contract?.expired_from?.period?.end),
            currentPlanName: current?.name ?? "",
          }
        : null,
      scheduled: scheduled
        ? {
            planName: scheduled.plan?.name ?? "The next plan",
            at: scheduled.at,
          }
        : null,
    }),
  };
}
