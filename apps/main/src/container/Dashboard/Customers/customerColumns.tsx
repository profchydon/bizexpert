import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { formatNgn } from "@/lib/bizexpert/format";
import type { Customer } from "@/types/bizexpert";

type Params = {
  renderActions: (item: Customer) => ReactNode;
};

export function customersTableColumns({
  renderActions,
}: Params): ColumnDef<Customer>[] {
  return [
    {
      header: "Customer",
      accessorKey: "name",
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          <span className="whitespace-nowrap text-sm font-medium text-gray-900">
            {row.original.name}
          </span>
          {row.original.phone ? (
            <p className="text-xs text-gray-500">{row.original.phone}</p>
          ) : null}
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.email || "—"}
        </span>
      ),
    },
    {
      header: "Credit limit",
      accessorKey: "creditLimit",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.creditLimit)}
        </span>
      ),
    },
    {
      header: "Outstanding",
      accessorKey: "outstandingBalance",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.outstandingBalance)}
        </span>
      ),
    },
    {
      header: "Wallet",
      accessorKey: "walletBalance",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.walletBalance)}
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
