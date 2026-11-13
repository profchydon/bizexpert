import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import OrderStatusBadgeV2 from "@/container/Dashboard/Orders/v2/components/OrderStatusBadgeV2";
import type { IRecentOrders } from "@/types/dashboard";

const MobileDashboardOrdersTableColumn = (
  action: (item: IRecentOrders) => ReactNode,
): readonly ColumnDef<IRecentOrders>[] => [
  {
    header: "Order",
    accessorKey: "orderId",
    cell: ({ row }) => {
      return (
        <div className="flex min-w-0 flex-col gap-1.5 py-1">
          <div className="break-all text-sm font-bold text-gray-900">
            {row.original.order_number}
          </div>
          <div className="text-xs text-gray-600">
            {dayjs(row.original.order_date).format("MMM DD, YYYY")}
          </div>
          <OrderStatusBadgeV2 status={row.original.status} />
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => action(row.original),
  },
];

export default MobileDashboardOrdersTableColumn;
