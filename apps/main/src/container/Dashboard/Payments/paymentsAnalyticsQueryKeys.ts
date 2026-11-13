import type { PaymentsAnalyticsFilters } from "./paymentsAnalyticsRange";

export const paymentsAnalyticsQueryKeys = {
  cashflow: (businessId: string, filters: PaymentsAnalyticsFilters) =>
    ["payments-cashflow", businessId, filters] as const,
  customers: (businessId: string, filters: PaymentsAnalyticsFilters) =>
    ["payments-customers", businessId, filters] as const,
};
