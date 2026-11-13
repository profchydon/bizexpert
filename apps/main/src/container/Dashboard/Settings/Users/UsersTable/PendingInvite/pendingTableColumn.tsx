import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, RefreshCcw } from "lucide-react";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import ReactCountryFlag from "react-country-flag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IEmployees } from "@/types/employees";

const PendingInviteTableColumn = (
  action: (item: any) => void,
): readonly ColumnDef<any>[] => [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-1">
          <Avatar>
            <AvatarFallback className="bg-gray-100 uppercase font-medium">
              {row?.original?.user?.first_name[0]}
              {row?.original?.user?.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-y-1">
            <span className="text-gray-900 text-sm font-medium">
              {row?.original?.user?.first_name} {row?.original?.user?.last_name}
            </span>

            <span className="text-sm text-gray-600">
              {row?.original?.email}
            </span>
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
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return <Badge variant="pending">Pending</Badge>;
    },
  },

  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => {
      return <div className="text-sm">{row?.original.role?.name}</div>;
    },
  },

  {
    id: "action",
    cell: ({ row }) => {
      return <>{action(row?.original)}</>;
    },
  },
];

export default PendingInviteTableColumn;
