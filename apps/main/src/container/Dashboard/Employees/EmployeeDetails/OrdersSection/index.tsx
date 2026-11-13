"use client";

import { IOrder } from "@/types/orders";
import EmployeeOrdersTable from "../tables/EmployeeOrdersTable";

type Props = {
  ordersData: IOrder[] | undefined;
};

const OrdersSection = ({ ordersData }: Props) => {
  return <EmployeeOrdersTable orders={ordersData ?? []} />;
};

export default OrdersSection;
