import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { StockMovement } from "@/types/bizexpert";
import { formatMovementType, toQuantityNumber } from "./inventoryStatus";

export function inventoryMovementColumns(): ColumnDef<StockMovement>[] {
  return [
    {
      header: "When",
      accessorKey: "createdAt",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {format(new Date(row.original.createdAt), "dd MMM yyyy, HH:mm")}
        </span>
      ),
    },
    {
      header: "Product",
      accessorKey: "product",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.product?.name ?? "—"}
        </span>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm capitalize text-gray-700">
          {formatMovementType(row.original.type)}
        </span>
      ),
    },
    {
      header: "Qty",
      accessorKey: "quantity",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {toQuantityNumber(row.original.quantity)}
        </span>
      ),
    },
  ];
}
