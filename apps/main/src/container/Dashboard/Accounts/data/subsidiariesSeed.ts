import type { Subsidiary } from "../types";

type SelfBillingSeed = Omit<
  Subsidiary,
  "billingMode" | "billingEntityId" | "billingEntityName" | "billingCurrency"
>;

function selfBilling(seed: SelfBillingSeed): Subsidiary {
  return {
    ...seed,
    billingMode: "self",
    billingEntityId: seed.id,
    billingEntityName: seed.name,
    billingCurrency: seed.currency,
  };
}

export const subsidiariesSeed: Subsidiary[] = [
  selfBilling({
    id: "sub-hq",
    name: "Acme Inc",
    region: "United States",
    currency: "USD",
    admins: ["Jordan Avery", "Amara Okafor"],
    status: "operational",
    officesCount: 4,
    creditState: "active-credit",
    cardOnFile: true,
    createdDaysAgo: 512,
    createdBy: "Jordan Avery",
    isPrimary: true,
  }),
  selfBilling({
    id: "sub-uk",
    name: "Acme UK Ltd",
    region: "United Kingdom",
    currency: "GBP",
    admins: ["Liam Bennett", "Sofia Marchetti"],
    status: "operational",
    officesCount: 3,
    creditState: "active-credit",
    cardOnFile: true,
    createdDaysAgo: 214,
    createdBy: "Jordan Avery",
  }),
  selfBilling({
    id: "sub-de",
    name: "Acme GmbH",
    region: "Germany",
    currency: "EUR",
    admins: ["Sofia Marchetti"],
    status: "operational",
    officesCount: 2,
    creditState: "assessing",
    cardOnFile: true,
    createdDaysAgo: 48,
    createdBy: "Liam Bennett",
  }),
  {
    id: "sub-ng",
    name: "Acme Nigeria Ltd",
    region: "Nigeria",
    currency: "GBP",
    admins: ["Amara Okafor"],
    status: "operational",
    officesCount: 1,
    creditState: "card-only",
    cardOnFile: false,
    createdDaysAgo: 4,
    createdBy: "Liam Bennett",
    billingMode: "delegated",
    billingEntityId: "sub-uk",
    billingEntityName: "Acme UK Ltd",
    billingCurrency: "GBP",
    billingConfirmedAt: "10 Jul 2026",
    billingConfirmedBy: "Jordan Avery",
  },
  selfBilling({
    id: "sub-ke",
    name: "Acme Kenya Ltd",
    region: "Kenya",
    currency: "USD",
    admins: ["David Kimani"],
    status: "card-pending",
    officesCount: 1,
    creditState: "card-only",
    cardOnFile: false,
    createdDaysAgo: 2,
    createdBy: "Jordan Avery",
  }),
  selfBilling({
    id: "sub-ca",
    name: "Acme Canada Inc",
    region: "Canada",
    currency: "USD",
    admins: ["Noah Schmidt"],
    status: "suspended",
    officesCount: 2,
    creditState: "card-only",
    cardOnFile: true,
    createdDaysAgo: 130,
    createdBy: "Jordan Avery",
  }),
  selfBilling({
    id: "sub-in",
    name: "Acme India Pvt Ltd",
    region: "India",
    currency: "USD",
    admins: ["Priya Nair"],
    status: "permanent-card-only",
    officesCount: 2,
    creditState: "card-only",
    cardOnFile: true,
    createdDaysAgo: 320,
    createdBy: "Jordan Avery",
  }),
  selfBilling({
    id: "sub-br",
    name: "Acme Brazil Ltda",
    region: "Brazil",
    currency: "USD",
    admins: ["Lucas Almeida"],
    status: "closed",
    officesCount: 0,
    creditState: "card-only",
    cardOnFile: true,
    createdDaysAgo: 410,
    createdBy: "Jordan Avery",
  }),
];

export const costCentreSpendSeed: Record<string, number> = {
  "sub-ng": 4820,
};

export function buildPrimarySubsidiary(
  companyName: string,
  countryLabel: string,
): Subsidiary {
  return selfBilling({
    id: "sub-primary",
    name: companyName,
    region: countryLabel,
    currency: "USD",
    admins: [],
    status: "operational",
    officesCount: 1,
    creditState: "active-credit",
    cardOnFile: true,
    createdDaysAgo: 365,
    createdBy: companyName,
    isPrimary: true,
  });
}
