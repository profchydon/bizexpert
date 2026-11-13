"use client";

import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Input } from "@/components/base/input/input";
import type { ColumnDef } from "@tanstack/react-table";
import type { StocktakeLine } from "@/types/bizexpert";
import { InventoryTableShell } from "../InventoryTableShell";
import { toQuantityNumber } from "../inventoryStatus";

type Props = {
  lines: StocktakeLine[];
  isLoading: boolean;
  isError: boolean;
  isOpen: boolean;
  counts: Record<string, number>;
  onCount: (lineId: string, value: number) => void;
};

export function stocktakeLineColumns(
  isOpen: boolean,
  counts: Record<string, number>,
  onCount: (lineId: string, value: number) => void,
): ColumnDef<StocktakeLine>[] {
  return [
    {
      header: "Product",
      accessorKey: "productName",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.productName}
        </span>
      ),
    },
    {
      header: "System",
      accessorKey: "systemQuantity",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {toQuantityNumber(row.original.systemQuantity)}
        </span>
      ),
    },
    {
      header: "Counted",
      accessorKey: "countedQuantity",
      enableSorting: false,
      cell: ({ row }) => {
        const counted =
          counts[row.original.id] ??
          toQuantityNumber(row.original.countedQuantity);
        if (!isOpen) {
          return (
            <span className="whitespace-nowrap text-sm font-medium text-gray-900">
              {row.original.countedQuantity == null
                ? "—"
                : toQuantityNumber(row.original.countedQuantity)}
            </span>
          );
        }
        return (
          <Input
            type="number"
            aria-label={`Counted quantity for ${row.original.productName}`}
            className="w-24"
            value={String(counted)}
            onChange={(value) =>
              onCount(row.original.id, value === "" ? 0 : Number(value))
            }
          />
        );
      },
    },
    {
      header: "Variance",
      accessorKey: "varianceQuantity",
      enableSorting: false,
      cell: ({ row }) => {
        const counted =
          counts[row.original.id] ??
          (row.original.countedQuantity == null
            ? null
            : toQuantityNumber(row.original.countedQuantity));
        const variance =
          counted == null
            ? null
            : counted - toQuantityNumber(row.original.systemQuantity);
        return (
          <span
            className={`whitespace-nowrap text-sm font-medium ${
              variance == null
                ? "text-gray-500"
                : variance === 0
                  ? "text-success-600"
                  : "text-warning-600"
            }`}
          >
            {variance ?? "—"}
          </span>
        );
      },
    },
  ];
}

export function StocktakeLinesTable({
  lines,
  isLoading,
  isError,
  isOpen,
  counts,
  onCount,
}: Props) {
  return (
    <InventoryTableShell title="Count lines" count={lines.length || undefined}>
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={lines}
          columns={stocktakeLineColumns(isOpen, counts, onCount)}
          paginationClassName={referenceTablePaginationClass}
        >
          <EmptyTableInstance
            title="No products to count"
            description="Receive stock at this location first, then start a count."
          />
        </DataTable>
      </PageState>
    </InventoryTableShell>
  );
}
