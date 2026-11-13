import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Stocktake } from "@/types/bizexpert";
import { formatStocktakeStatus } from "./inventoryStatus";

type Params = {
  renderActions: (item: Stocktake) => ReactNode;
};

export function inventoryStocktakeColumns({
  renderActions,
}: Params): ColumnDef<Stocktake>[] {
  return [
    {
      header: "Stocktake",
      accessorKey: "stocktakeNumber",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.stocktakeNumber}
        </span>
      ),
    },
    {
      header: "Location",
      accessorKey: "location",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.location?.name ?? "—"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm capitalize text-gray-700">
          {formatStocktakeStatus(row.original.status)}
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
