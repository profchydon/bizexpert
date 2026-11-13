import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { StockTransfer } from "@/types/bizexpert";
import { formatTransferStatus } from "./inventoryStatus";

type Params = {
  renderActions: (item: StockTransfer) => ReactNode;
};

export function inventoryTransferColumns({
  renderActions,
}: Params): ColumnDef<StockTransfer>[] {
  return [
    {
      header: "Transfer",
      accessorKey: "transferNumber",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.transferNumber}
        </span>
      ),
    },
    {
      header: "From",
      accessorKey: "sourceLocation",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.sourceLocation?.name ?? "—"}
        </span>
      ),
    },
    {
      header: "To",
      accessorKey: "destinationLocation",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.destinationLocation?.name ?? "—"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm capitalize text-gray-700">
          {formatTransferStatus(row.original.status)}
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
