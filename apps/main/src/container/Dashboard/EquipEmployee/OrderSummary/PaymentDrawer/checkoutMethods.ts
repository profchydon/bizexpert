import {
  type BillingSignalSource,
  isDelegatedBillingSource,
} from "@/components/Drawers/PaymentMethods/CreditMethod/isDelegatedCheckoutBilling";
import type { CheckoutWalletView } from "@/components/Drawers/PaymentMethods/CreditMethod/resolveCheckoutWalletView";
import type { FeeSummaryLike } from "@/lib/tax/feeSummary";
import formatAmount from "@/utils/formatAmount";

export type BillingMembership = NonNullable<BillingSignalSource> & {
  id: string;
  name: string;
  is_primary: boolean;
  parent_company_id: string | null;
};

export function resolveBilledEntityName({
  officeEntities,
  memberships,
  activeEntityId,
  companyName,
}: {
  officeEntities: { id: string; name?: string }[];
  memberships: BillingMembership[];
  activeEntityId?: string | null;
  companyName?: string;
}): string | undefined {
  const byId = (id?: string | null) =>
    id ? memberships.find((membership) => membership.id === id) : undefined;
  const primary = memberships.find((membership) => membership.is_primary);
  const payerFor = (id: string, fallbackName?: string) => {
    const membership = byId(id);
    if (membership && isDelegatedBillingSource(membership)) {
      return (byId(membership.parent_company_id) ?? primary)?.name;
    }
    return membership?.name ?? fallbackName;
  };

  const officePayers = [
    ...new Set(
      officeEntities
        .map((entity) => payerFor(entity.id, entity.name))
        .filter((name): name is string => Boolean(name)),
    ),
  ];
  if (officePayers.length > 0) return officePayers.join(" and ");

  const active = activeEntityId ? byId(activeEntityId) : undefined;
  if (active && !active.is_primary) {
    return payerFor(active.id) ?? companyName ?? primary?.name;
  }

  return companyName ?? primary?.name;
}

export function cardGatewayFee(summary?: FeeSummaryLike): number | null {
  const fee = Number(summary?.payment_gateway_fee);
  return Number.isFinite(fee) && fee > 0 ? fee : null;
}

export type CheckoutTab = "Card" | "Credit";

export interface CheckoutCredit {
  isAvailable: boolean;
  isShort: boolean;
  available: number | null;
  shortfall: number;
  note: string;
}

export const PLAN_BLOCKED_NOTE =
  "Not available. Credit isn't included on Procure. Charges go to the card on file.";
export const NO_CREDIT_NOTE =
  "Not available. Your account has no Rayda credit yet.";
export const CREDIT_LOADING_NOTE = "Checking your available credit…";
export const DELEGATED_CREDIT_NOTE =
  "Billed to another entity, which settles this order from its Rayda credit.";
export const BANK_TRANSFER_NOTE =
  "Not available yet. Pay by card or Rayda credit.";
export const CARD_UNAVAILABLE_NOTE =
  "Not available. Card payments aren't set up for your billing country.";

export const formatCheckoutMoney = (amount: number, symbol: string) =>
  `${symbol}${formatAmount(amount)}`;

const blocked = (note: string): CheckoutCredit => ({
  isAvailable: false,
  isShort: false,
  available: null,
  shortfall: 0,
  note,
});

export function resolveCheckoutCredit({
  view,
  total,
  isProcure,
  symbol,
}: {
  view: CheckoutWalletView;
  total: number;
  isProcure: boolean;
  symbol: string;
}): CheckoutCredit {
  if (isProcure) return blocked(PLAN_BLOCKED_NOTE);
  if (view.kind === "loading") return blocked(CREDIT_LOADING_NOTE);
  if (view.kind === "empty") return blocked(NO_CREDIT_NOTE);
  if (view.kind === "delegated") {
    return {
      isAvailable: true,
      isShort: false,
      available: null,
      shortfall: 0,
      note: DELEGATED_CREDIT_NOTE,
    };
  }

  const available = view.wallet.available;
  const isShort = available < total;

  return {
    isAvailable: true,
    isShort,
    available,
    shortfall: isShort ? Math.round((total - available) * 100) / 100 : 0,
    note: `Pay from the credit Rayda has extended to you. ${formatCheckoutMoney(available, symbol)} available.`,
  };
}

export function resolveOpenMethod({
  tab,
  isCardAvailable,
  isCreditAvailable,
}: {
  tab: CheckoutTab;
  isCardAvailable: boolean;
  isCreditAvailable: boolean;
}): CheckoutTab | null {
  if (tab === "Credit" && isCreditAvailable) return "Credit";
  if (isCardAvailable) return "Card";
  return isCreditAvailable ? "Credit" : null;
}
