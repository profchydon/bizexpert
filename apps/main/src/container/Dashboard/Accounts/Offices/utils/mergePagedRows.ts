export interface PagedRow {
  id?: string | number | null;
}

export function mergePagedRows<T extends PagedRow>(
  current: T[],
  incoming: T[],
  page: number,
): T[] {
  const base = page <= 1 ? [] : current;
  const seen = new Set(base.map((row) => String(row.id)));
  return [...base, ...incoming.filter((row) => !seen.has(String(row.id)))];
}

export function syncOpenPagedRows<T extends PagedRow>(
  isOpen: boolean,
  current: T[],
  incoming: T[] | undefined,
  page: number | undefined,
): T[] {
  if (!isOpen) return current.length === 0 ? current : [];
  if (incoming === undefined || page === undefined) return current;
  return mergePagedRows(current, incoming, page);
}
