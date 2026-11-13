import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { Product } from "@/types/bizexpert";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductStatusBadge } from "./ProductStatusBadge";

type Params = {
  renderActions: (item: Product) => ReactNode;
};

export function productsTableColumns({
  renderActions,
}: Params): ColumnDef<Product>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Product",
      accessorKey: "name",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.name}
        </span>
      ),
    },
    {
      header: "Type",
      accessorKey: "kind",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm capitalize text-gray-700">
          {row.original.kind ?? "product"}
        </span>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.category || "—"}
          {row.original.subCategory ? (
            <span className="block text-xs text-gray-500">
              {row.original.subCategory}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      header: "Stock",
      accessorKey: "totalStock",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.kind === "service"
            ? "—"
            : (row.original.totalStock ?? 0)}
        </span>
      ),
    },
    {
      header: "Variants",
      accessorKey: "variantCount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.hasVariants ? (row.original.variantCount ?? 0) : "—"}
        </span>
      ),
    },
    {
      header: "Price",
      accessorKey: "sellingPrice",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-gray-900">
          {row.original.hasVariants
            ? "—"
            : formatNgn(row.original.sellingPrice)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      enableSorting: false,
      cell: ({ row }) => (
        <ProductStatusBadge isActive={row.original.isActive} />
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
