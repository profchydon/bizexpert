import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { InventoryLocationRow } from "./inventoryOverviewTypes";

export function inventoryLocationColumns(): ColumnDef<InventoryLocationRow>[] {
  return [
    {
      header: "Store",
      accessorKey: "locationName",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.locationName}
        </span>
      ),
    },
    {
      header: "Sales",
      accessorKey: "salesCount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.salesCount}
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
