import { mapEntityBillingCurrency } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityBillingCurrency";
import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { companyBillingCurrency } from "@/utils/companyBillingCurrency";

type CompanyBilling = {
  name?: string | null;
  billing_currency?: string | null;
  billing_currency_code?: string | null;
};

export function billingEntityDisplay(input: {
  entity?: EntityApiRecord | null;
  company?: CompanyBilling | null;
}): { name: string; currencyCode: string } {
  const entity = input.entity;
  if (entity) {
    const payer =
      entity.billing_responsibility === "delegated"
        ? entity.delegated_payer
        : null;
    return {
      name: payer?.name?.trim() || entity.name,
      currencyCode: mapEntityBillingCurrency(entity),
    };
  }

  return {
    name: input.company?.name?.trim() || "Your Company",
    currencyCode: companyBillingCurrency(input.company),
  };
}
