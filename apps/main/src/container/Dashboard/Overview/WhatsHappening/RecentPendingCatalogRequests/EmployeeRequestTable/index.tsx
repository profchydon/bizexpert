"use client";

import React, { useMemo, useState } from "react";
import { z } from "zod";

import EmployeeRequestTableActions from "./tableAction";
import EmployeeRequestTableColumn from "./tableColumn";
import MobileOverviewEmployeeRequestTableColumn from "./mobileTableColumn";
import { overviewResponsiveTableClass } from "@/container/Dashboard/Overview/overviewDashboardLayout";
import {
  overviewDataTableProps,
  overviewMobileDataTableProps,
} from "@/container/Dashboard/Overview/overviewTableClasses";
import { DataTable } from "@/components/ui/data-table";
import { TableCard } from "@/components/application/table/table";
import { useRouter, useSearchParams } from "next/navigation";
import SearchWithIcon from "@/components/SearchWithIcon";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { IEmployeeRequest, IEmployees } from "@/types/employees";
import PageState from "@/components/PageState";
import { useGetAdminCatalogRequestsQuery } from "@/api/baseQueries/companiesApi/employeesApi/getAdminCatalogRequests";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { useAppDispatch } from "@/store";
import routes from "@/routes";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import formatAmount from "@/utils/formatAmount";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { ICatalog } from "@/types/catalog";
import ViewEmployeeDetails from "../ViewEmployeeDetails";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";

const EmployeeRequestTable = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();

  const [employeeDetails, setEmployeeDetails] = useState<IEmployeeRequest>();

  const { data: dashboadRes } = useWorkspaceDashboardQuery({ skip: !company });
  const dashboardData = dashboadRes?.data;

  const requests = dashboardData?.recent_catalog_order_requests ?? [];

  const renderAction = (item: IEmployeeRequest) => (
    <EmployeeRequestTableActions
      item={item}
      onView={() => setEmployeeDetails(item)}
    />
  );

  const billingSymbol = companyBillingCurrencySymbol(company);
  const columns: any = useMemo(
    () => EmployeeRequestTableColumn(renderAction, billingSymbol),
    [billingSymbol],
  );

  const mobileColumns: any = useMemo(
    () => MobileOverviewEmployeeRequestTableColumn(renderAction),
    [],
  );
  return (
    <div className="flex flex-col gap-y-6">
      <TableCard.Root>
        <TableCard.Header
          title="Recent catalog requests"
          description="Review pending catalog requests placed"
        />

        <div className="flex flex-col gap-y-5 px-4 pb-5 sm:px-6">
          <div className={overviewResponsiveTableClass.desktop}>
            <DataTable
              data={requests}
              columns={columns}
              {...overviewDataTableProps}
            >
              <EmptyTableInstance
                title="No requests"
                description="No requests have been made yet"
              />
            </DataTable>
          </div>
          <div className={overviewResponsiveTableClass.mobile}>
            <DataTable
              data={requests}
              columns={mobileColumns}
              {...overviewMobileDataTableProps}
            >
              <EmptyTableInstance
                title="No requests"
                description="No requests have been made yet"
              />
            </DataTable>
          </div>
        </div>
      </TableCard.Root>

      <ViewEmployeeDetails
        isOpen={Boolean(employeeDetails)}
        onClose={() => setEmployeeDetails(undefined)}
        employeeDetails={employeeDetails}
      />
    </div>
  );
};

export default EmployeeRequestTable;
