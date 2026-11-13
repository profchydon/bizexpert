import React, { useEffect, useMemo, useState } from "react";
import EmployeesEmptyTable from "../EmployeesEmptyTable";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchWithIcon from "@/components/SearchWithIcon";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import PageState from "@/components/PageState";
import AllEmployeesTableActions from "./tableAction";
import AllEmployeeTableColumn from "./tableColumn";
import { useDebounce } from "use-debounce";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { Button } from "@/components/ui/button";
import { IEmployees } from "@/types/employees";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useRouter, useSearchParams } from "next/navigation";
import displayErrorMessage from "@/utils/displayErrorMessage";
import routes from "@/routes";

const SelectEmployeesTable = () => {
  const router = useRouter();
  const params = useSearchParams();
  const employeeId = params.get("employee_id");
  const dispatch = useAppDispatch();
  const { selectedEmployee } = useAppSelector(
    (state) => state.persistedReducers.employee,
  );
  const companyId = useWorkspaceCompanyId();
  const [search, setSearch] = useState<string | null>(null);
  const [searchValue] = useDebounce(search, 2000);

  const [page, setPage] = useState<number>(1);
  const [selectedExternalRows, setSelectedExternalRows] = useState<
    Record<string, boolean>
  >({});
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);

  const {
    data: employeesRes,
    isLoading,
    isError,
  } = useGetEmployeesQuery(
    {
      companyId: companyId as string,
      params: {
        search: !searchValue ? null : searchValue,
        page,
      },
    },
    { skip: !companyId },
  );

  const employees = employeesRes?.data?.data;
  // @ts-ignore
  const currentPage = employeesRes?.data?.current_page ?? 1;
  // @ts-ignore
  const lastPage = employeesRes?.data?.last_page ?? 1;

  const handleClearSelection = () => {
    setSelectedExternalRows({});
    setSelectedRows([]);
  };

  const columns: any = useMemo(
    () =>
      AllEmployeeTableColumn((item: IEmployees) => (
        <AllEmployeesTableActions
          key={item?.id}
          item={item}
          onAdd={() => {
            router.push(
              `${routes.STORAGE_SELECT_EMPLOYEES}?employee_id=${item.id}`,
            );
          }}
        />
      )),
    [],
  );

  const handleAddEmployees = () => {
    const selectedRowsIds = selectedRows.map((data: any) => data.id);
    const employeeIds = selectedEmployee?.map((item) => item.id);

    const payload =
      employees
        ?.filter((item: any) => selectedRowsIds.includes(item?.id))
        .map((data) => ({ ...data, actionType: "Transfer" })) ?? [];

    if (!employeeId) {
      const newItems = payload.filter(
        (item) => !employeeIds?.includes(item.id),
      );
      if (selectedEmployee) {
        if (newItems.length > 0) {
          dispatch(setSelectedEmployees([...selectedEmployee!, ...newItems]));
          handleClearSelection();
          displaySuccessMessage(
            "Employee(s) added successfully!",
            " They are now ready to be assigned devices.",
          );
        }
      } else {
        dispatch(setSelectedEmployees(payload));
        handleClearSelection();
        displaySuccessMessage(
          "Employee(s) added successfully!",
          " They are now ready to be assigned devices.",
        );
      }
    }

    if (employeeId) {
      if (employeeIds?.includes(employeeId)) {
        return displayErrorMessage("Employee already selected");
      } else {
        dispatch(
          setSelectedEmployees(
            [
              ...selectedEmployee!,
              employees?.find((item) => item.id === employeeId)!,
            ].map((data) => ({ ...data, actionType: "Transfer" })),
          ),
        );
        displaySuccessMessage(
          "Employee added successfully!",
          " They are now ready to be assigned devices.",
        );
      }
    }
  };

  useEffect(() => {
    if (employeeId) {
      handleAddEmployees();
      router.push(routes.STORAGE_SELECT_EMPLOYEES);
    }
  }, [employeeId]);

  return (
    <>
      <Card className="mt-2">
        <CardHeader className="p-2 border-b border-border-secondary flex flex-row items-center justify-between px-6">
          <h3 className="text-lg flex flex-row items-center gap-3 font-semibold text-gray-900">
            Employees{" "}
            {employees?.length && (
              <Badge
                variant={"blue"}
                className="empty:hidden bg-primary-25 text-primary-700"
              >
                {employees?.length}
              </Badge>
            )}
          </h3>
          <div className="flex flex-row gap-x-4">
            {selectedRows?.length > 0 && (
              <Button
                variant={"outline"}
                className="text-sm border border-primary-400 font-semibold text-primary-700"
                onClick={() => {
                  handleAddEmployees();
                }}
                data-testid="employeestable-button"
              >
                Add employees
              </Button>
            )}
            <div className="sm:w-[35ch]">
              <SearchWithIcon
                className="w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name, Country, Email"
              />
            </div>
          </div>
        </CardHeader>
        <PageState isLoading={isLoading} isError={isError}>
          <CardContent className="px-0 pt-0 pb-2">
            <DataTable
              data={employees || []}
              columns={columns}
              pagination={{
                currentPage,
                lastPage,
                onPageChange: (value) => setPage(value),
              }}
              externalRowSelection={selectedExternalRows}
              setSeletectedValue={setSelectedRows}
            >
              <EmployeesEmptyTable />
            </DataTable>
          </CardContent>
        </PageState>
      </Card>
    </>
  );
};

export default SelectEmployeesTable;
