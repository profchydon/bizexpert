import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { IOrder } from "@/types/orders";
import formatAmount from "@/utils/formatAmount";
import OrderStatusBadgeV2 from "./components/OrderStatusBadgeV2";
import OrderTypeBadgeV2 from "./components/OrderTypeBadgeV2";
import OrderDevicesCell from "./components/OrderDevicesCell";
import OrderCountryCell from "./components/OrderCountryCell";
import OrderNumberNavigateButton from "./components/OrderNumberNavigateButton";

interface Params {
  orderHref: (order: IOrder) => string;
  renderActions: (order: IOrder) => React.ReactNode;
}

export const ordersColumnsV2 = ({
  orderHref,
  renderActions,
}: Params): ColumnDef<IOrder>[] => [
  {
    header: "Order ID",
    accessorKey: "order_number",
    enableSorting: false,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <OrderNumberNavigateButton
          orderId={order.id}
          orderNumber={order.order_number}
          employeeCount={order.employee_count ?? 0}
          href={orderHref(order)}
        />
      );
    },
  },
  {
    header: "Order date",
    accessorKey: "order_date",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-gray-700">
        {dayjs(row.original.order_date).format("MMM DD, YYYY")}
      </span>
    ),
  },
  {
    header: "Order status",
    accessorKey: "status",
    enableSorting: false,
    cell: ({ row }) => <OrderStatusBadgeV2 status={row.original.status} />,
  },
  {
    header: "Total amount",
    accessorKey: "total_amount",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-gray-700">
        {row.original.currency || ""}
        {formatAmount(row.original.total_amount)}
      </span>
    ),
  },
  {
    header: "Type",
    accessorKey: "type",
    enableSorting: false,
    cell: ({ row }) => <OrderTypeBadgeV2 type={row.original.type} />,
  },
  {
    header: "Devices",
    id: "devices",
    enableSorting: false,
    cell: ({ row }) => <OrderDevicesCell order={row.original} />,
  },
  {
    header: "Countries",
    id: "countries",
    enableSorting: false,
    cell: ({ row }) => <OrderCountryCell order={row.original} />,
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
