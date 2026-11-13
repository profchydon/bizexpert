import { format, startOfMonth } from "date-fns";

export type PaymentsAnalyticsFilters = {
  locationId: string;
  startDate: string;
  endDate: string;
};

export function toDateInput(value: Date): string {
  return format(value, "yyyy-MM-dd");
}

export function defaultPaymentsAnalyticsFilters(
  now = new Date(),
): PaymentsAnalyticsFilters {
  return {
    locationId: "",
    startDate: toDateInput(startOfMonth(now)),
    endDate: toDateInput(now),
  };
}

export function paymentsAnalyticsParams(filters: PaymentsAnalyticsFilters) {
  return {
    locationId: filters.locationId || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  };
}
