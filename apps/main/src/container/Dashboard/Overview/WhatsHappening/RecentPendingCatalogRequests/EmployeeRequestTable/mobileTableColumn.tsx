import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import { IEmployeeRequest } from "@/types/employees";

const requestStatusBadge = (status: string) => {
  if (status === "approved") {
    return <Badge variant="success">Approved</Badge>;
  }

  if (status === "pending") {
    return <Badge variant="pending">Pending</Badge>;
  }

  if (status === "rejected") {
    return <Badge variant="mild">Rejected</Badge>;
  }

  return null;
};

const MobileOverviewEmployeeRequestTableColumn = (
  action: (item: IEmployeeRequest) => ReactNode,
): readonly ColumnDef<IEmployeeRequest>[] => [
  {
    header: "Request",
    accessorKey: "first_name",
    cell: ({ row }) => {
      const employee = row.original.employee;

      return (
        <div className="flex min-w-0 flex-col gap-2 py-1">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {employee?.first_name?.[0]}
                {employee?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {employee?.first_name} {employee?.last_name}
              </p>
              <p className="truncate text-xs text-gray-600">
                {row.original.catalog?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-600">
              {dayjs(row.original.created_at).format("MMM DD, YYYY")}
            </span>
            {requestStatusBadge(row.original.status)}
          </div>
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => action(row.original),
  },
];

export default MobileOverviewEmployeeRequestTableColumn;
