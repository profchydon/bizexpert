import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { InventoryBalance } from "@/types/bizexpert";
import { toQuantityNumber } from "../Inventory/inventoryStatus";

export function trackItemStockColumns(): ColumnDef<InventoryBalance>[] {
  return [
    {
      header: "Store",
      accessorKey: "location",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.location?.name ?? "—"}
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
    {
      header: "Avg cost",
      accessorKey: "averageCost",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.averageCost)}
        </span>
      ),
    },
    {
      header: "Value",
      accessorKey: "totalValue",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {formatNgn(row.original.totalValue)}
        </span>
      ),
    },
  ];
}
