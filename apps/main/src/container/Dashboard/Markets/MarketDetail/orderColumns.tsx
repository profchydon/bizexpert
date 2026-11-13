import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { MarketRemoteOrder } from "../marketDummyData";

export function marketOrderColumns(): ColumnDef<MarketRemoteOrder>[] {
  return [
    {
      header: "Order",
      accessorKey: "orderNumber",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.orderNumber}
        </span>
      ),
    },
    {
      header: "Product",
      accessorKey: "productName",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.productName}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.amount)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm capitalize text-gray-700">
          {row.original.status}
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
