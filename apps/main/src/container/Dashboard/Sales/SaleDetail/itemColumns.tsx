import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { SaleItem } from "@/types/bizexpert";

export function saleItemColumns(): ColumnDef<SaleItem>[] {
  return [
    {
      header: "Product",
      accessorKey: "productName",
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          <span className="whitespace-nowrap text-sm font-medium text-gray-900">
            {row.original.productName}
          </span>
          <p className="text-xs text-gray-500">{row.original.unitName}</p>
        </div>
      ),
    },
    {
      header: "Qty",
      accessorKey: "quantity",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.quantity}
        </span>
      ),
    },
    {
      header: "Unit price",
      accessorKey: "unitPrice",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.unitPrice)}
        </span>
      ),
    },
    {
      header: "Discount",
      accessorKey: "discountAmount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.discountAmount)}
        </span>
      ),
    },
    {
      header: "Line total",
      accessorKey: "lineTotal",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.lineTotal)}
        </span>
      ),
    },
  ];
}
