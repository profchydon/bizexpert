import { currencySymbol } from "@/utils/currencySymbol";

type BillingCompany =
  | {
      billing_currency?: string | null;
      billing_currency_code?: string | null;
    }
  | null
  | undefined;

export function companyBillingCurrency(company: BillingCompany): string {
  return (
    company?.billing_currency?.trim() ||
    company?.billing_currency_code?.trim() ||
    ""
  );
}

export function companyBillingCurrencySymbol(company: BillingCompany): string {
  return currencySymbol(companyBillingCurrency(company)) || "";
}
