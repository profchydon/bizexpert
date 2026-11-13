import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { TopCustomerRow } from "./paymentsAnalyticsTypes";

export function customerAnalyticsColumns(): ColumnDef<TopCustomerRow>[] {
  return [
    {
      header: "Customer",
      accessorKey: "customerName",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.customerName}
        </span>
      ),
    },
    {
      header: "Sales",
      accessorKey: "saleCount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.saleCount}
        </span>
      ),
    },
    {
      header: "Spend",
      accessorKey: "totalSpent",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {formatNgn(row.original.totalSpent)}
        </span>
      ),
    },
  ];
}
