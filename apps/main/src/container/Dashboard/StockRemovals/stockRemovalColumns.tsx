import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { StockMovement } from "@/types/bizexpert";
import { removedQuantity } from "./stockRemovalSchema";

type Params = {
  locationName: (locationId: string | undefined) => string;
};

export function stockRemovalColumns({
  locationName,
}: Params): ColumnDef<StockMovement>[] {
  return [
    {
      header: "Product",
      accessorKey: "product",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.product?.name ?? "—"}
        </span>
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
      header: "Qty removed",
      accessorKey: "quantity",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {removedQuantity(row.original.quantity)}
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
    {
      header: "Cost",
      accessorKey: "totalCost",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.totalCost)}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {format(new Date(row.original.createdAt), "d MMM yyyy HH:mm")}
        </span>
      ),
    },
  ];
}
