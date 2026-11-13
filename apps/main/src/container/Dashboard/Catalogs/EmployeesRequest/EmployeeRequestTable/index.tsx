"use client";

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import EmployeeRequestTableActions from "./tableAction";
import EmployeeRequestTableColumn from "./tableColumn";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import SearchWithIcon from "@/components/SearchWithIcon";
import ViewEmployeeDetails from "../ViewEmployeeDetails";
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
import { useDebounce } from "use-debounce";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const EmployeeRequestTable: React.FC<{ catalog?: ICatalog }> = ({
  catalog,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();

  const [search, setSearch] = useState<string | null>(null);
  const [searchValue] = useDebounce(search, 2000);
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();

  const [employeeDetails, setEmployeeDetails] = useState<IEmployeeRequest>();

  const {
    data: requestsRes,
    isError,
    isLoading,
  } = useGetAdminCatalogRequestsQuery(
    {
      companyId: companyId!,
      catalogId: catalog?.id!,
      params: {
        search: !searchValue ? null : searchValue,
      },
    },
    { skip: !catalog },
  );
  const requests = requestsRes?.data.requests ?? [];
  const approvedReqs = requests?.filter(
    (req) => req.status === "approved",
  ).length;

  const approveAllEmployees = requests.map((req) => {
    const employees = req.employee;
    const newEmployees = {
      ...employees,
      items: req.items,
      requestId: req.id,
    } as IEmployees;
    return newEmployees;
  });

  const columns: any = useMemo(
    () =>
      EmployeeRequestTableColumn(
        (item: IEmployeeRequest) => (
          <EmployeeRequestTableActions
            item={item}
            onView={() => setEmployeeDetails(item)}
          />
        ),
        billingSymbol,
      ),
    [billingSymbol],
  );
  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <CardHeader className="p-2 border-b border-border-secondary flex flex-row items-center justify-between">
          <h3 className="text-lg flex flex-row items-center gap-3 font-semibold text-gray-900">
            {billingSymbol}
            {formatAmount(String(catalog?.total_amount ?? "0"))}
            {/* {catalogs?.[0]?.total_amount && (
              <Badge className="empty:hidden bg-primary-25 text-primary-700">
                {catalogs[0].total_amount}
              </Badge>
            )} */}
          </h3>
          <div className="flex flex-row items-center text-base font-semibold gap-x-2">
            <SearchWithIcon
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* <Button
              onClick={toggleFilterEmployeeRequest}
              variant="outline"
              className="text-sm flex flex-row gap-x-2"
            >
              <ListFilter />
              <div className="text-sm font-semibold text-gray-700">Filter</div>
            </Button> */}

            {/* {approvedReqs !== catalog?.total_requests && (
              <Button
                onClick={() => {
                  dispatch(setSelectedEmployees(approveAllEmployees));
                  router.push(
                    `${routes.EQUIP_EMPLOYEE_ORDER_SUMMARY}?catalogId=${catalog?.id}`,
                  );
                }}
                data-testid="employeerequesttable-button"
              >
                Approve all
              </Button>
            )} */}
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          <PageState isError={isError} isLoading={isLoading}>
            <DataTable data={requests} columns={columns}>
              <EmptyTableInstance
                title="No requests"
                description="No requests have been made yet"
              />
            </DataTable>
          </PageState>
        </CardContent>
      </Card>

      <ViewEmployeeDetails
        isOpen={Boolean(employeeDetails)}
        onClose={() => setEmployeeDetails(undefined)}
        employeeDetails={employeeDetails}
      />
    </div>
  );
};

export default EmployeeRequestTable;
