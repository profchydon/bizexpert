export const EMPLOYEE_DETAIL_TABLE_PAGE_SIZE = 5;

export const getEmployeeDetailTotalPages = (totalItems: number) =>
  Math.max(1, Math.ceil(totalItems / EMPLOYEE_DETAIL_TABLE_PAGE_SIZE));

export const getEmployeeDetailPageSlice = <T>(rows: T[], page: number) => {
  const totalPages = getEmployeeDetailTotalPages(rows.length);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * EMPLOYEE_DETAIL_TABLE_PAGE_SIZE;

  return {
    pageRows: rows.slice(start, start + EMPLOYEE_DETAIL_TABLE_PAGE_SIZE),
    currentPage,
    totalPages,
    showPagination: rows.length > EMPLOYEE_DETAIL_TABLE_PAGE_SIZE,
  };
};
