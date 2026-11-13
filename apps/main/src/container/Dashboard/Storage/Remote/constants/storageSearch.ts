export const STORAGE_SEARCH_DEBOUNCE_MS = 500;

export function normalizeStorageSearchQuery(search: string) {
  return search.trim().toLowerCase();
}

export function isDebouncedSearchPending(
  search: string,
  debouncedSearch: string,
) {
  return (
    normalizeStorageSearchQuery(search) !==
    normalizeStorageSearchQuery(debouncedSearch)
  );
}

export interface StorageOrderSearchFields {
  id: string;
  orderNumber?: string;
  deviceName: string;
  serialNumber?: string;
}

export function storageOrderMatchesSearch(
  order: StorageOrderSearchFields,
  search: string,
) {
  const query = normalizeStorageSearchQuery(search);
  if (!query) return true;

  return [order.orderNumber, order.id, order.deviceName, order.serialNumber]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(query));
}

export function extraStorageOrderPages(lastPage: number) {
  if (lastPage <= 1) return [];
  return Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
}

export function paginateStorageOrders<T>(
  items: T[],
  page: number,
  pageSize: number,
) {
  const start = (Math.max(1, page) - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
