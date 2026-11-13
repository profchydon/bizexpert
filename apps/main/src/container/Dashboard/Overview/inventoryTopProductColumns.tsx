import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { InventoryTopProductRow } from "./inventoryOverviewTypes";

export function inventoryTopProductColumns(): ColumnDef<InventoryTopProductRow>[] {
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
      header: "Qty",
      accessorKey: "totalQuantity",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.totalQuantity}
        </span>
      ),
    },
    {
      header: "Revenue",
      accessorKey: "totalRevenue",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.totalRevenue)}
        </span>
      ),
    },
    {
      header: "Profit",
      accessorKey: "totalProfit",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.totalProfit)}
        </span>
      ),
    },
  ];
}
