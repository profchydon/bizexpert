import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { ProductUnit } from "@/types/bizexpert";
import { toQuantityNumber } from "../../Inventory/inventoryStatus";

type Params = {
  baseUnit: string;
  renderActions: (item: ProductUnit) => ReactNode;
};

export function productUnitColumns({
  baseUnit,
  renderActions,
}: Params): ColumnDef<ProductUnit>[] {
  return [
    {
      header: "Unit",
      accessorKey: "unitName",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.unitName}
        </span>
      ),
    },
    {
      header: "Factor",
      accessorKey: "conversionFactor",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {toQuantityNumber(row.original.conversionFactor)} × {baseUnit}
        </span>
      ),
    },
    {
      header: "Price",
      accessorKey: "sellingPrice",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.sellingPrice
            ? formatNgn(row.original.sellingPrice)
            : "—"}
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
