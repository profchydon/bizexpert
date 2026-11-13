export const DEVICE_REFRESH_COUNTRIES_PAGE_SIZE = 10;

export type ClientPageResult<T> = {
  items: T[];
  currentPage: number;
  lastPage: number;
  total: number;
};

export const paginateClientPage = <T>(
  items: T[],
  page: number,
  pageSize = DEVICE_REFRESH_COUNTRIES_PAGE_SIZE,
): ClientPageResult<T> => {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize) || 1);
  const currentPage = Math.min(Math.max(page, 1), lastPage);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    lastPage,
    total,
  };
};
