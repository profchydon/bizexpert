import type { EntityApiRecord } from "./types";

export function mapEntityBillingCurrency(entity: EntityApiRecord): string {
  const isDelegated = entity.billing_responsibility === "delegated";
  const payerCurrency = entity.delegated_payer?.billing_currency?.trim();

  if (isDelegated && payerCurrency) {
    return payerCurrency;
  }

  const billingCurrency = entity.billing_currency?.trim();
  if (billingCurrency) {
    return billingCurrency;
  }

  return "";
}
