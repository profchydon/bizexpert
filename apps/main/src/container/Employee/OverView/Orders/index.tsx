import EmptyTableInstance from "@/components/EmptyTableInstance";
import { DataTable } from "@/components/ui/data-table";
import React, { useMemo, useState } from "react";
import OrdersTableColumn from "./OrdersTableColumn";
import OrderTableActions from "./OrderTableActions";
import { Button } from "@/components/ui/button";
import OrderDetail from "./OrderDetail";
import { IOrder } from "@/types/orders";
import Link from "next/link";
import routes from "@/routes";

const Orders: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
  const [orderDetail, setOrderDetail] = useState<IOrder>();

  const columns: any = useMemo(
    () =>
      OrdersTableColumn((item) => (
        <OrderTableActions onView={() => setOrderDetail(item)} />
      )),
    [],
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg text-gray-900 font-semibold">Orders</h2>
          <span className="text-sm">View your orders here</span>
        </div>
        <Link href={routes.EMPLOYEE_ORDERS}>
          <Button data-testid="orders-button">All orders</Button>
        </Link>
      </div>

      <DataTable data={orders} columns={columns}>
        <EmptyTableInstance
          title="No orders yet"
          description="You have no orders yet"
        />
      </DataTable>

      <OrderDetail
        orderDetail={orderDetail}
        isOpen={Boolean(orderDetail)}
        onClose={() => setOrderDetail(undefined)}
      />
    </div>
  );
};

export default Orders;
