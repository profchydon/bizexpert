import React, { useMemo, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";

import DepartmentTableColumn from "./tableColumns";
import DepartmentTableActions from "./tableActions";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import PageState from "@/components/PageState";
import { useGetDepartmentsQuery } from "@/api/baseQueries/companiesApi/departmentsApi/getDepartments";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Button } from "@/components/ui/button";
import EditDepartment from "../EditDepartment";
import CreateDepartment from "../CreateDepartment";
import DeleteDepartmentModal from "../DeleteDepartmentModal";
import DepartmentEmptyTable from "../DepartmentEmptyTable";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { IDepartment } from "@/types/departments";
import MoveMembersToDepartment from "../MoveMembersToDepartment";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  departmentTableToolbarContentClass,
  departmentTableToolbarSectionClass,
} from "../departmentPageClasses";

const DepartmentTable = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const [departmentDetail, setDepartmentDetail] = useState<IDepartment>();
  const { page, setPage } = useTablePageQuery();

  const {
    data: departmentRes,
    isLoading,
    isFetching,
    isError,
  } = useGetDepartmentsQuery({
    companyId: companyId!,
    params: { page },
  });
  const isDepartmentLoading = isLoading;

  const departments = departmentRes?.data.data;
  // @ts-ignore
  const currentPage = departmentRes?.data.current_page ?? 1;
  // @ts-ignore
  const lastPage = departmentRes?.data.last_page ?? 1;

  const [department, setDepartment] = useState<IDepartment>();
  const toggleEditDepartment = (value: IDepartment) => setDepartment(value);

  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false);
  const toggleCreateDepartment = () =>
    setIsCreateDepartmentOpen(!isCreateDepartmentOpen);

  const [isDeleteDepartmentModalOpen, setDeleteDepartmentModalOpen] =
    useState(false);
  const toggleDeleteDepartmentModal = () => {
    setDeleteDepartmentModalOpen(!isDeleteDepartmentModalOpen);
  };

  const [isMoveDepartmentOpen, setIsMoveDepartmentOpen] = useState(false);
  const toggleMoveDepartmentModal = () =>
    setIsMoveDepartmentOpen(!isMoveDepartmentOpen);

  const columns: any = useMemo(
    () =>
      DepartmentTableColumn((item) => (
        <DepartmentTableActions
          item={item}
          onView={() => {}}
          onEdit={() => toggleEditDepartment(item)}
          onDelete={() => {
            setDepartmentDetail(item);
            toggleDeleteDepartmentModal();
          }}
        />
      )),
    [],
  );

  return (
    <div>
      <Card className="overflow-hidden">
        <div className={departmentTableToolbarSectionClass}>
          <div className={departmentTableToolbarContentClass}>
            <SearchWithIcon className="min-w-0 flex-1" />
            <Button
              variant="primary"
              onClick={toggleCreateDepartment}
              size="md"
              className="shrink-0"
              data-testid="departmenttable-button"
            >
              Create department
            </Button>
          </div>
        </div>
        <PageState isLoading={isDepartmentLoading} isError={isError}>
          <CardContent className="px-0 pt-0 pb-2">
            <DataTable
              data={departments || []}
              columns={columns}
              pagination={{
                currentPage,
                lastPage,
                onPageChange: (value) => setPage(value),
              }}
            >
              <DepartmentEmptyTable />
            </DataTable>
          </CardContent>
        </PageState>
      </Card>

      <EditDepartment
        isOpen={Boolean(department)}
        onClose={() => setDepartment(undefined)}
        department={department}
      />

      <CreateDepartment
        isOpen={isCreateDepartmentOpen}
        onClose={toggleCreateDepartment}
      />

      <DeleteDepartmentModal
        isOpen={isDeleteDepartmentModalOpen}
        onClose={() => {
          toggleDeleteDepartmentModal();
          setDepartmentDetail(undefined);
        }}
        onDelete={() => {
          toggleDeleteDepartmentModal();
          toggleMoveDepartmentModal();
        }}
        departmentDetail={departmentDetail}
      />

      <MoveMembersToDepartment
        isOpen={isMoveDepartmentOpen}
        onClose={() => {
          toggleMoveDepartmentModal();
        }}
        departmentDetail={departmentDetail}
        setDepartmentDetail={() => setDepartmentDetail(undefined)}
      />
    </div>
  );
};

export default DepartmentTable;
