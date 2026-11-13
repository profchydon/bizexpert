import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IEmployeeRequest } from "@/types/employees";
import formatAmount from "@/utils/formatAmount";
import { Badge } from "@/components/ui/badge";

const EmployeeRequestTableColumn = (
  action: (item: IEmployeeRequest) => void,
  symbol: string,
): readonly ColumnDef<IEmployeeRequest>[] => [
  {
    header: "Name",
    accessorKey: "first_name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-gray-600 bg-gray-100">
              {row?.original?.employee?.first_name[0]}
              {row?.original?.employee?.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-gray-900 font-medium text-sm">
              {row?.original?.employee?.first_name}{" "}
              {row?.original?.employee?.last_name}
            </p>
            <p className="text-gray-600 text-sm">
              {row?.original?.employee?.level_position?.name ?? (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
          </div>
        </div>
      );
    },
  },

  {
    header: "Department",
    accessorKey: "department",
    cell: ({ row }) => {
      return (
        <div>
          <p>
            {row?.original?.department?.name ?? (
              <Badge variant="red">Not available</Badge>
            )}
          </p>
        </div>
      );
    },
  },

  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row }) => {
      return (
        <p>
          {row?.original?.employee?.address ?? (
            <Badge variant="red">Not available</Badge>
          )}
        </p>
      );
    },
  },

  {
    header: "Total Amount",
    accessorKey: "total_amount",
    cell: ({ row }) => {
      return (
        <p>
          {symbol}
          {formatAmount(row?.original?.total_amount)}
        </p>
      );
    },
  },

  {
    header: "Approval Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <div>
          {row?.original?.status === "approved" && (
            <Badge variant="success">Approved</Badge>
          )}
          {row?.original?.status === "pending" && (
            <Badge variant="pending">Pending</Badge>
          )}
          {row?.original?.status === "rejected" && (
            <Badge variant="mild">Rejected</Badge>
          )}
        </div>
      );
    },
  },

  {
    id: "action",
    cell: ({ row }) => {
      return action(row?.original);
    },
  },
];

export default EmployeeRequestTableColumn;
