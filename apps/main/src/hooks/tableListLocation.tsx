"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  withListLocation,
  type TableListLocation,
} from "@/utils/tableListPage";

const TableListLocationContext = createContext<TableListLocation>({ page: 1 });

export function TableListLocationProvider({
  page,
  tab,
  pageKey,
  children,
}: TableListLocation & { children: ReactNode }) {
  const value = useMemo(() => ({ page, tab, pageKey }), [page, tab, pageKey]);
  return (
    <TableListLocationContext.Provider value={value}>
      {children}
    </TableListLocationContext.Provider>
  );
}

export function useTableListLocation() {
  return useContext(TableListLocationContext);
}

export function useListDetailHref(href: string) {
  return withListLocation(href, useTableListLocation());
}
