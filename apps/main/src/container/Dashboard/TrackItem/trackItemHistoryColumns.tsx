import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { StockMovement } from "@/types/bizexpert";
import {
  formatMovementType,
  toQuantityNumber,
} from "../Inventory/inventoryStatus";

export function trackItemHistoryColumns(): ColumnDef<StockMovement>[] {
  return [
    {
      header: "When",
      accessorKey: "createdAt",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {format(new Date(row.original.createdAt), "d MMM yyyy HH:mm")}
        </span>
      ),
    },
    {
      header: "Store",
      accessorKey: "locationId",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.location?.name ?? "—"}
        </span>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm capitalize text-gray-700">
          {formatMovementType(row.original.type)}
        </span>
      ),
    },
    {
      header: "Qty",
      accessorKey: "quantity",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {toQuantityNumber(row.original.quantity)}
        </span>
      ),
    },
    {
      header: "Reason",
      accessorKey: "reason",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.reason || "—"}
        </span>
      ),
    },
  ];
}
