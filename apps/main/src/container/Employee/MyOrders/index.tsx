"use client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import PageState from "@/components/PageState";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetEmployeeCatalogRequestsQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeCatalogRequests";
import OrdersTableColumn from "./OrdersTableColumn";
import OrderTableActions from "./OrderTableActions";
import { IEmployeeRequest } from "@/types/employees";
import { DataTable } from "@/components/ui/data-table";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Card, CardContent } from "@/components/ui/card";
import OrderDetail from "./OrderDetail";

const MyOrders = () => {
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();

  const [employeeReq, setEmployeeReq] = useState<IEmployeeRequest>();

  const {
    data: requestsRes,
    isError,
    isLoading,
  } = useGetEmployeeCatalogRequestsQuery({
    employeeId: user?.id!,
    companyId: company?.id!,
  });
  const requests = requestsRes?.data.requests ?? [];

  const columns: any = useMemo(
    () =>
      OrdersTableColumn((item) => (
        <OrderTableActions onView={() => setEmployeeReq(item)} />
      )),
    [],
  );

  return (
    <PageState isError={isError} isLoading={isLoading}>
      <div className="font-semibold text-2xl text-gray-900 pt-8">My orders</div>
      <Separator className="my-6" />

      <Card>
        <CardContent className="p-0">
          <DataTable data={requests} columns={columns}>
            <EmptyTableInstance
              title="No orders yet"
              description="You have no orders yet"
            />
          </DataTable>
        </CardContent>
      </Card>

      <OrderDetail
        isOpen={Boolean(employeeReq)}
        employeeRequest={employeeReq}
        onClose={() => setEmployeeReq(undefined)}
      />
    </PageState>
  );
};

export default MyOrders;
