import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { Sale } from "@/types/bizexpert";
import { SalePaymentBadge, SaleStatusBadge } from "./saleBadges";
import { formatSaleSource } from "./saleFilterOptions";

type Params = {
  locationName: (locationId: string) => string;
  renderActions: (item: Sale) => ReactNode;
};

export function salesTableColumns({
  locationName,
  renderActions,
}: Params): ColumnDef<Sale>[] {
  return [
    {
      header: "Sale",
      accessorKey: "saleNumber",
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          <span className="whitespace-nowrap text-sm font-medium text-gray-900">
            {row.original.saleNumber}
          </span>
          <p className="text-xs text-gray-500">
            {row.original.customerName || "Walk-in"}
          </p>
        </div>
      ),
    },
    {
      header: "Store",
      accessorKey: "locationId",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.location?.name ?? locationName(row.original.locationId)}
        </span>
      ),
    },
    {
      header: "Total",
      accessorKey: "totalAmount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {formatNgn(row.original.totalAmount)}
        </span>
      ),
    },
    {
      header: "Profit",
      accessorKey: "grossProfit",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.grossProfit)}
        </span>
      ),
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      enableSorting: false,
      cell: ({ row }) => (
        <SalePaymentBadge status={row.original.paymentStatus} />
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      enableSorting: false,
      cell: ({ row }) => <SaleStatusBadge status={row.original.status} />,
    },
    {
      header: "Source",
      accessorKey: "source",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatSaleSource(row.original.source)}
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
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">{renderActions(row.original)}</div>
      ),
    },
  ];
}
