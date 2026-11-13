import type { Subsidiary, SubsidiaryStatus } from "../types";

const currencyName: Record<string, string> = {
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
};

const blockedPayerStatuses = new Set<SubsidiaryStatus>(["closed", "suspended"]);

export type BillingEntityOption = {
  value: string;
  label: string;
  description: string;
  currency: string;
};

export function isEligibleDelegatedPayer(subsidiary: Subsidiary) {
  return (
    subsidiary.billingMode === "self" &&
    !blockedPayerStatuses.has(subsidiary.status)
  );
}

export function mapBillingEntityOptions(
  subsidiaries: Subsidiary[],
): BillingEntityOption[] {
  return subsidiaries.filter(isEligibleDelegatedPayer).map((subsidiary) => ({
    value: subsidiary.id,
    label: subsidiary.name,
    currency: subsidiary.currency,
    description: `Bills in ${subsidiary.currency} (${currencyName[subsidiary.currency] ?? subsidiary.currency}). ${subsidiary.region}.`,
  }));
}

export function billingEntityOptionById(
  options: BillingEntityOption[],
  id: string | null,
) {
  if (!id) return null;
  return options.find((option) => option.value === id) ?? null;
}
