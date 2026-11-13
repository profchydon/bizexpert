import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { PaymentListItem } from "@/types/bizexpert";
import { formatPaymentMethod } from "../Sales/saleFilterOptions";

type Params = {
  renderActions: (item: PaymentListItem) => ReactNode;
};

export function paymentColumns({
  renderActions,
}: Params): ColumnDef<PaymentListItem>[] {
  return [
    {
      header: "Sale",
      accessorKey: "sale",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.sale?.saleNumber ?? "—"}
        </span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customer",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.sale?.customerName || "Walk-in"}
        </span>
      ),
    },
    {
      header: "Store",
      accessorKey: "location",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.sale?.location?.name ?? "—"}
        </span>
      ),
    },
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
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => renderActions(row.original),
    },
  ];
}
