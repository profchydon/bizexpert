import type { ColumnDef } from "@tanstack/react-table";
import type { InventoryLowStockRow } from "./inventoryOverviewTypes";

export function inventoryLowStockColumns(): ColumnDef<InventoryLowStockRow>[] {
  return [
    {
      header: "Product",
      accessorKey: "productName",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.productName}
        </span>
      ),
    },
    {
      header: "Store",
      accessorKey: "locationName",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.locationName}
        </span>
      ),
    },
    {
      header: "On hand",
      accessorKey: "currentStock",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-700 ring-1 ring-inset ring-error-200">
          {row.original.currentStock}
        </span>
      ),
    },
    {
      header: "Threshold",
      accessorKey: "threshold",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.threshold}
        </span>
      ),
    },
  ];
}
