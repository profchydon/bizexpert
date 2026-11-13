import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ManageRoleRow } from "./defaultBusinessRoles";

type Params = {
  renderActions: (item: ManageRoleRow) => ReactNode;
};

export function manageRoleColumns({
  renderActions,
}: Params): ColumnDef<ManageRoleRow>[] {
  return [
    {
      header: "Role",
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
      accessorKey: "isDefault",
      enableSorting: false,
      cell: () => (
        <span className="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
          Default
        </span>
      ),
    },
    {
      header: "Members",
      accessorKey: "memberCount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.memberCount}
        </span>
      ),
    },
    {
      header: "Access",
      accessorKey: "summary",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="line-clamp-2 text-sm text-gray-700">
          {row.original.summary}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => renderActions(row.original),
    },
  ];
}
