import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import OrderStatusBadgeV2 from "@/container/Dashboard/Orders/v2/components/OrderStatusBadgeV2";
import OrderTypeBadgeV2 from "@/container/Dashboard/Orders/v2/components/OrderTypeBadgeV2";
import type { IRecentOrders } from "@/types/dashboard";
import dayjs from "dayjs";
import ReactCountryFlag from "react-country-flag";

const DashboardOrdersTableColumn = (
  action: (item: IRecentOrders) => void,
): readonly ColumnDef<IRecentOrders>[] => {
  const columns: ColumnDef<IRecentOrders>[] = [
    {
      header: "Order ID",
      accessorKey: "orderId",
      cell: ({ row }) => {
        return (
          <div className="font-bold text-gray-900 text-sm">
            {row?.original.order_number}
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
            {dayjs(row?.original.order_date).format("MMM DD, YYYY")}
          </div>
        );
      },
    },
    {
      header: "Order status",
      accessorKey: "status",
      cell: ({ row }) => <OrderStatusBadgeV2 status={row.original.status} />,
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => <OrderTypeBadgeV2 type={row.original.type} />,
    },
    {
      header: "Country",
      accessorKey: "country",
      cell: ({ row }) => {
        if (row?.original?.country_code) {
          return (
            <div className="text-sm flex gap-x-3 items-center">
              <ReactCountryFlag
                countryCode={row?.original?.country_code || ""}
                className=""
                svg
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
              <span>{row?.original?.country || ""}</span>
            </div>
          );
        }
        return <Badge variant="red">Not available</Badge>;
      },
    },
    {
      id: "action",
      cell: ({ row }) => {
        return <>{action(row?.original)}</>;
      },
    },
  ];

  return columns;
};

export default DashboardOrdersTableColumn;
