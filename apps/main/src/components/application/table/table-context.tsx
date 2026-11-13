"use client";

import { createContext, useContext } from "react";

export type TableSize = "sm" | "md";

export const TableContext = createContext<{ size: TableSize }>({ size: "md" });

export const useTableSize = () => useContext(TableContext);
