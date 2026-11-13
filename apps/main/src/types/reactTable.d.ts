import { ColumnDef, ColumnMeta } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    isCollapse?: boolean;
  }
}
