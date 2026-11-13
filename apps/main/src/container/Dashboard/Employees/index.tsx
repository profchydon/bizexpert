"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import EmployeesTable from "./EmployeesTable";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetCompanyUsersQuery } from "@/api/baseQueries/companiesApi/employeesApi/getUsers";
import AddEmployees from "../EquipEmployee/Employee/AddEmployees";
import EditEmployeeDrawer from "../EquipEmployee/Employee/AddEmployees/AddEmployee/EditEmployeeDrawer";
import type { IEmployees } from "@/types/employees";
import EmployeeAddedDialog from "./EmployeeAddedDialog";
import { employeeDetailPath } from "./employeeAddedDialogUtils";
import { useViewNavigation } from "@/hooks/useViewNavigation";

type EmployeeAddTab = "import" | "add" | "hris" | "invite";

const AllEmployees = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  useGetCompanyUsersQuery({
    companyId: company?.id as string,
  });

  const [isImportEmployeeOpen, setIsImportEmployeeOpen] = useState(false);
  const [addEmployeeTab, setAddEmployeeTab] =
    useState<EmployeeAddTab>("import");
  const [createdEmployee, setCreatedEmployee] = useState<IEmployees | null>(
    null,
  );
  const isEmployeeAddedDialogOpen = Boolean(createdEmployee);

  const toggleImportEmployee = () => {
    setAddEmployeeTab("import");
    setIsImportEmployeeOpen(true);
  };

  const handleImportEmployeeClose = () => {
    setIsImportEmployeeOpen(false);
    router.push("/dashboard/employees");
  };

  const handleImportEmployeeOpen = () => {
    setIsImportEmployeeOpen(true);
  };

  const handleEmployeeAdded = (employee: IEmployees) => {
    setCreatedEmployee(employee);
  };

  const handleAddAnotherEmployee = () => {
    setCreatedEmployee(null);
    setAddEmployeeTab("add");
    setIsImportEmployeeOpen(true);
  };

  const { view: viewEmployee, isPending: isViewEmployeePending } =
    useViewNavigation();

  const handleViewCreatedEmployee = () => {
    if (!createdEmployee?.id) return;
    viewEmployee(employeeDetailPath(String(createdEmployee.id)));
    setCreatedEmployee(null);
  };

  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const toggleEditEmployeeDrawer = (employee_id: string) => {
    setIsEditEmployeeOpen(!isEditEmployeeOpen);
    router.replace(`/dashboard/employees?id=${employee_id}`);
  };

  const handleEditEmployeeClose = () => {
    setIsEditEmployeeOpen(!isEditEmployeeOpen);
    router.push("/dashboard/employees");
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const integrationParam = searchParams.get("integration");
    const codeParam = searchParams.get("code");

    if (tabParam === "hris" || integrationParam || codeParam) {
      setIsImportEmployeeOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={["Employees"]}
        pageTitle="Manage Employees"
        pageDescription="Easily provide your employees with the necessary hardware to start their journey in your company."
        onBack={() => router.back()}
      >
        <div className="md:self-end flex gap-3 pb-5">
          <Button
            variant="primary"
            data-testid="employees-button"
            onClick={toggleImportEmployee}
          >
            <span className="text-sm font-semibold">Add/Import Employees</span>
          </Button>
        </div>
      </PageHeader>

      <div className="mt-8">
        <EmployeesTable handleEditBtn={toggleEditEmployeeDrawer} />
      </div>

      <AddEmployees
        isOpen={isImportEmployeeOpen}
        onClose={handleImportEmployeeClose}
        onOpen={handleImportEmployeeOpen}
        employeepage_instance
        initialTab={addEmployeeTab}
        onEmployeeAdded={handleEmployeeAdded}
      />

      <EmployeeAddedDialog
        employee={createdEmployee}
        isOpen={isEmployeeAddedDialogOpen}
        onAddAnother={handleAddAnotherEmployee}
        onClose={() => setCreatedEmployee(null)}
        onViewEmployee={handleViewCreatedEmployee}
        isViewEmployeeLoading={isViewEmployeePending}
      />

      <EditEmployeeDrawer
        isOpen={isEditEmployeeOpen}
        onClose={handleEditEmployeeClose}
        employeepage_instance
      />
    </div>
  );
};

export default AllEmployees;
