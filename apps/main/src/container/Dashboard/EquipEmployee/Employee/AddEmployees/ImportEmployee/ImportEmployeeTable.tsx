"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { AddBulkEmployeeRequest, IEmployees } from "@/types/employees";
import { useRouter } from "next/navigation";
import { validateArrayObjects } from "@/utils/validateArrayObjects";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { useAddBulkEmployeesMutation } from "@/api/baseQueries/companiesApi/employeesApi/addBulkEmployees";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import {
  resetImportedEmployees,
  setImportedEmployees,
  setSelectedEmployees,
} from "@/store/slices/employeeSlice";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import useDepartment from "@/hooks/useDepartment";
import useLevel from "@/hooks/useLevel";
import { ImportEmployeePreviewFooter } from "./importEmployeePreviewFooter";
import { ImportEmployeePreviewTable } from "./ImportEmployeePreviewTable";
import { importEmployeeEditPath } from "./importEmployeeEditPaths";

interface Props {
  onClose: () => void;
  clearArrayData: () => void;
  onReupload: () => void;
  employeepage_instance?: boolean;
}

const ImportEmployeeTable = ({
  clearArrayData,
  onClose,
  onReupload,
  employeepage_instance = false,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employeeData =
    (useAppSelector(
      (state) => state.persistedReducers?.employee?.importedEmployee,
    ) as IEmployees[]) || [];

  const companyId = useWorkspaceCompanyId();
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const { levelsById } = useLevel();
  const { departmentById } = useDepartment();
  const [addBulkEmployees, { isLoading }] = useAddBulkEmployeesMutation();

  const handleCancel = () => {
    router.replace(
      employeepage_instance
        ? "/dashboard/employees"
        : "/dashboard/equip-employee/employees",
    );
    clearArrayData();
    dispatch(resetImportedEmployees());
    onClose();
  };

  const handleSubmit = async () => {
    const properties = ["id", "first_name", "last_name", "email"];
    const validationError = validateArrayObjects(employeeData, properties);
    if (typeof validationError === "string") {
      displayErrorMessage(validationError);
      return;
    }

    const payload = {
      companyId: companyId,
      payload: {
        employees: employeeData.map(({ id, phone, ...rest }) => ({
          ...rest,
          phone: phone ? phone.toString() : "",
        })),
      },
    } as AddBulkEmployeeRequest;

    const res = await addBulkEmployees(payload).unwrap();

    if (!employeepage_instance) {
      if (employees) {
        const existingEmployeeIds = employees.map((employee) => employee.id);
        const created = res?.data?.filter(
          (newEmployee: IEmployees) =>
            !existingEmployeeIds.includes(newEmployee.id),
        );
        if (created.length > 0) {
          dispatch(setSelectedEmployees([...employees, ...created]));
        }
      } else {
        dispatch(setSelectedEmployees(res?.data));
      }
    }

    displaySuccessMessage(
      "Employee added successfully",
      "New employees has been added to the company roster.",
    );
    handleCancel();
  };

  const editPath = (employeeId: string) =>
    importEmployeeEditPath(employeeId, employeepage_instance);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
        <ImportEmployeePreviewTable
          rows={employeeData}
          levelsById={levelsById}
          departmentById={departmentById}
          onRemove={(employeeId) =>
            dispatch(
              setImportedEmployees(
                employeeData.filter(
                  (employee) => Number(employee.id) !== Number(employeeId),
                ) as IEmployees[],
              ),
            )
          }
          onEdit={(employeeId) => router.replace(editPath(employeeId))}
        />
      </div>

      <ImportEmployeePreviewFooter
        onCancel={handleCancel}
        onContinue={() => void handleSubmit()}
        onReupload={onReupload}
        isSubmitting={isLoading}
        canContinue={employeeData.length > 0}
      />
    </>
  );
};

export default ImportEmployeeTable;
