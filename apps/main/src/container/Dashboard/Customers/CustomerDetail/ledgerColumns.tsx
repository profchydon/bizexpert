import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { CustomerLedger } from "@/types/bizexpert";
import { formatLedgerType } from "../customerLedgerSchema";

export function customerLedgerColumns(): ColumnDef<CustomerLedger>[] {
  return [
    {
      header: "Type",
      accessorKey: "type",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-900">
          {formatLedgerType(row.original.type)}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {formatNgn(row.original.amount)}
        </span>
      ),
    },
    {
      header: "Note",
      accessorKey: "note",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {row.original.note || "—"}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {format(new Date(row.original.createdAt), "d MMM yyyy")}
        </span>
      ),
    },
  ];
}
