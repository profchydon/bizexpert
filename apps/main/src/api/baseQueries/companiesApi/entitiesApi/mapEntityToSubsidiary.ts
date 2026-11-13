import { differenceInCalendarDays, parseISO } from "date-fns";
import type {
  BillingMode,
  CreditState,
  Subsidiary,
} from "@/container/Dashboard/Accounts/types";
import { mapBillingStatusBadge } from "@/container/Dashboard/Accounts/utils/subsidiaryStatus";
import { mapEntityBillingCurrency } from "./mapEntityBillingCurrency";
import { mapEntityCountryLabel } from "./mapEntityCountryLabel";
import type { EntityApiRecord } from "./types";

export { mapBillingStatusBadge } from "@/container/Dashboard/Accounts/utils/subsidiaryStatus";

export function mapCreditState(value: string): CreditState {
  switch (value) {
    case "assessing":
      return "assessing";
    case "active_credit":
    case "net_30":
    case "active-credit":
      return "active-credit";
    default:
      return "card-only";
  }
}

export function mapBillingMode(value: string): BillingMode {
  return value === "delegated" ? "delegated" : "self";
}

export function createdDaysAgoFromIso(createdAt: string): number {
  const created = parseISO(createdAt);
  if (Number.isNaN(created.getTime())) return 0;
  return Math.max(0, differenceInCalendarDays(new Date(), created));
}

export function mapEntityToSubsidiary(entity: EntityApiRecord): Subsidiary {
  const billingMode = mapBillingMode(entity.billing_responsibility);
  const payer = entity.delegated_payer;
  const billingEntityId =
    billingMode === "delegated" && payer ? payer.id : entity.id;
  const billingEntityName =
    billingMode === "delegated" && payer ? payer.name : entity.name;
  const billingCurrency = mapEntityBillingCurrency(entity);

  return {
    id: entity.id,
    name: entity.name,
    region: mapEntityCountryLabel(entity.country),
    currency: billingCurrency,
    admins: [],
    status: mapBillingStatusBadge(
      entity.billing_status_badge,
      entity.lifecycle_status,
      entity.permanent_card_only,
    ),
    officesCount: entity.offices_count,
    creditState: mapCreditState(entity.credit_state),
    cardOnFile: entity.card_captured,
    createdDaysAgo: createdDaysAgoFromIso(entity.created_at),
    createdBy: entity.email,
    isPrimary: entity.is_primary,
    billingMode,
    billingEntityId,
    billingEntityName,
    billingCurrency,
  };
}
