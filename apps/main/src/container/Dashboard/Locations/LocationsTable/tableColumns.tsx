import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Location } from "@/types/bizexpert";
import { LocationTypeBadge } from "../locationTypeBadge";
import { LocationDefaultBadge } from "../locationDefaultBadge";
import { formatStoreBusinessType } from "../storeBusinessTypes";

type Params = {
  renderActions: (item: Location) => ReactNode;
};

function formatVatRate(value: Location["vatRate"]): string {
  const rate = Number(value ?? 0);
  if (Number.isNaN(rate)) return "—";
  return `${rate}%`;
}

export function locationsTableColumns({
  renderActions,
}: Params): ColumnDef<Location>[] {
  return [
    {
      header: "Store",
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
      accessorKey: "type",
      enableSorting: false,
      cell: ({ row }) => <LocationTypeBadge type={row.original.type} />,
    },
    {
      header: "Business type",
      accessorKey: "businessType",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatStoreBusinessType(row.original.businessType)}
        </span>
      ),
    },
    {
      header: "VAT",
      accessorKey: "vatRate",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatVatRate(row.original.vatRate)}
        </span>
      ),
    },
    {
      header: "Address",
      accessorKey: "address",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.address || "—"}
        </span>
      ),
    },
    {
      header: "Default",
      accessorKey: "isDefault",
      enableSorting: false,
      cell: ({ row }) => (
        <LocationDefaultBadge isDefault={row.original.isDefault} />
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
