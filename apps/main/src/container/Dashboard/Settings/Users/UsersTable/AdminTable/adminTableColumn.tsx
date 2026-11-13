import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, RefreshCcw } from "lucide-react";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import ReactCountryFlag from "react-country-flag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IEmployees } from "@/types/employees";
import { adminScopeLabel } from "../../adminScopeLabel";

const AdminTableColumn = (
  action: (item: IEmployees) => void,
): readonly ColumnDef<IEmployees>[] => [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-1">
          <Avatar>
            <AvatarFallback className="bg-gray-100 uppercase font-medium">
              {row?.original.first_name[0]}
              {row?.original.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-y-1">
            <span className="text-gray-900 text-sm font-medium">
              {row?.original.first_name} {row?.original.last_name}
            </span>

            <span className="text-sm text-gray-600">{row?.original.email}</span>
          </div>
        </div>
      );
    },
  },

  {
    header: "Date Added",
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {dayjs(row.original.created_at).format("MMM DD, YYYY")}
        </div>
      );
    },
  },

  {
    header: "Scope",
    accessorKey: "scope",
    cell: ({ row }) => {
      return <div className="text-sm">{adminScopeLabel(row.original)}</div>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <div>
          {row?.original.status == "Active" ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="pending">Pending</Badge>
          )}
        </div>
      );
    },
  },

  {
    header: "Last active",
    accessorKey: "active",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {row?.original.last_login
            ? dayjs(row?.original.last_login).format("MMM DD, YYYY")
            : "--- --, ----"}
        </div>
      );
    },
  },

  {
    id: "action",
    cell: ({ row }) => {
      return <>{action(row?.original)}</>;
    },
  },
];

export default AdminTableColumn;
