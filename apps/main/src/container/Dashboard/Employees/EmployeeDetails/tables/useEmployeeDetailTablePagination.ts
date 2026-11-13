"use client";

import { useResetTablePage } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { getEmployeeDetailPageSlice } from "./employeeDetailTablePageSlice";

export const useEmployeeDetailTablePagination = <T>(
  rows: T[],
  resetKey: string,
  pageParam = "page",
) => {
  const { page, setPage } = useTablePageQuery(pageParam);
  useResetTablePage(setPage, resetKey);

  return {
    setPage,
    ...getEmployeeDetailPageSlice(rows, page),
  };
};
