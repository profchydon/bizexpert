import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, RefreshCcw } from "lucide-react";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import { IEmployeeRequest } from "@/types/employees";

const OrdersTableColumn = (
  action: (item: IEmployeeRequest) => void,
): readonly ColumnDef<IEmployeeRequest>[] => {
  const columns: ColumnDef<IEmployeeRequest>[] = [
    {
      header: "Order ID",
      accessorKey: "orderId",
      cell: ({ row }) => {
        return (
          <div className="font-bold text-gray-900 text-sm">
            {row.original.order?.order_number ?? (
              <Badge variant="red">Not available</Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Order date",
      accessorKey: "date",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {(row.original?.order &&
              dayjs(row.original.order.order_date).format("MMM DD, YYYY")) ?? (
              <Badge variant="red">Not available</Badge>
            )}
          </div>
        );
      },
    },

    {
      header: "Catalog",
      accessorKey: "catalog",
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-primary-600">
            {row?.original?.catalog?.name}
          </div>
        );
      },
    },

    {
      header: "Budget count",
      accessorKey: "budget-count",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.original.catalog?.config?.budget_count ?? (
              <Badge variant="red">Not available</Badge>
            )}
          </div>
        );
      },
    },

    {
      header: "No. of items",
      accessorKey: "items",
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.items_count}</div>;
      },
    },

    {
      header: "Approval status",
      accessorKey: "approval-status",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row?.original.status === "approved" && (
              <Badge variant="success">Approved</Badge>
            )}
            {row?.original.status === "pending" && (
              <Badge variant="pending">Pending</Badge>
            )}
            {row?.original.status === "rejected" && (
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

  return columns;
};

export default OrdersTableColumn;
