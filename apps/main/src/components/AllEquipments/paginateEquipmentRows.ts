export function paginateEquipmentRows<T>(
  rows: T[],
  page: number,
  pageSize: number,
) {
  const lastPage = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, lastPage);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    currentPage: safePage,
    lastPage,
    total: rows.length,
  };
}

export const equipmentEntityScopePageSize = 10;
