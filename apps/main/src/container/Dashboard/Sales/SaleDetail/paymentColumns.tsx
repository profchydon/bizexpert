import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { SalePayment } from "@/types/bizexpert";
import { formatPaymentMethod } from "../saleFilterOptions";

export function salePaymentColumns(): ColumnDef<SalePayment>[] {
  return [
    {
      header: "Amount",
      accessorKey: "amount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {formatNgn(row.original.amount)}
        </span>
      ),
    },
    {
      header: "Method",
      accessorKey: "method",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatPaymentMethod(row.original.method)}
        </span>
      ),
    },
    {
      header: "Reference",
      accessorKey: "reference",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.reference || "—"}
        </span>
      ),
    },
    {
      header: "Paid at",
      accessorKey: "paidAt",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {format(new Date(row.original.paidAt), "d MMM yyyy HH:mm")}
        </span>
      ),
    },
  ];
}
