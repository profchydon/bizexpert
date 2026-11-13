export type SalesTableFilterState = {
  search: string;
  locationId: string;
  status: string;
  source: string;
  startDate: string;
  endDate: string;
};

export const emptySalesFilters: SalesTableFilterState = {
  search: "",
  locationId: "",
  status: "",
  source: "",
  startDate: "",
  endDate: "",
};

export function salesFiltersAreActive(filters: SalesTableFilterState): boolean {
  return Boolean(
    filters.search.trim() ||
    filters.locationId ||
    filters.status ||
    filters.source ||
    filters.startDate ||
    filters.endDate,
  );
}
