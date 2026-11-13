import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, RefreshCcw } from "lucide-react";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";

const OrdersTableColumn = (
  action: (item: IOrder) => void,
): readonly ColumnDef<IOrder>[] => {
  const columns: ColumnDef<IOrder>[] = [
    {
      header: "Order ID",
      accessorKey: "orderId",
      cell: ({ row }) => {
        return (
          <div className="font-bold text-gray-900 text-sm">
            {row.original.order_number}
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
            {dayjs(row.original.order_date).format("MMM DD, YYYY")}
          </div>
        );
      },
    },

    {
      header: "No. of items",
      accessorKey: "items",
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.no_of_items}</div>;
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
