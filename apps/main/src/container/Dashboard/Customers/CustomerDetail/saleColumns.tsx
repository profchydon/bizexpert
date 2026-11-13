import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { CustomerSale } from "@/types/bizexpert";

export function customerSaleColumns(): ColumnDef<CustomerSale>[] {
  return [
    {
      header: "Sale",
      accessorKey: "saleNumber",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.saleNumber}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "totalAmount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.totalAmount)}
        </span>
      ),
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm capitalize text-gray-700">
          {row.original.paymentStatus}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {format(new Date(row.original.createdAt), "d MMM yyyy")}
        </span>
      ),
    },
  ];
}
