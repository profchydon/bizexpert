export const ORDER_LIST_FILTER_KEYS = [
  "status",
  "type",
  "country",
  "from",
  "to",
] as const;

export type OrderListFilterKey = (typeof ORDER_LIST_FILTER_KEYS)[number];

export type OrderListFilters = Partial<Record<OrderListFilterKey, string>>;

type FilterSource = {
  get(name: string): string | null;
};

export function readOrderListFilters(search: FilterSource): OrderListFilters {
  const filters: OrderListFilters = {};
  for (const key of ORDER_LIST_FILTER_KEYS) {
    const value = search.get(key)?.trim();
    if (value) filters[key] = value;
  }
  return filters;
}

export function normalizeOrderListFilters(input: {
  status?: string | null;
  type?: string | null;
  country?: string | null;
  from?: string | null;
  to?: string | null;
}): OrderListFilters {
  const params = new URLSearchParams();
  for (const key of ORDER_LIST_FILTER_KEYS) {
    const value = input[key]?.trim();
    if (value) params.set(key, value);
  }
  return readOrderListFilters(params);
}

export function writeOrderListFilters(
  params: URLSearchParams,
  filters: OrderListFilters,
) {
  for (const key of ORDER_LIST_FILTER_KEYS) {
    const value = filters[key]?.trim();
    if (value) params.set(key, value);
    else params.delete(key);
  }
}

export function orderListFilterQuery(
  filters: OrderListFilters,
): Record<string, string> {
  const query: Record<string, string> = {};
  for (const key of ORDER_LIST_FILTER_KEYS) {
    const value = filters[key]?.trim();
    if (value) query[key] = value;
  }
  return query;
}

export function orderListFiltersKey(filters: OrderListFilters) {
  return ORDER_LIST_FILTER_KEYS.map((key) => filters[key] ?? "").join("|");
}
