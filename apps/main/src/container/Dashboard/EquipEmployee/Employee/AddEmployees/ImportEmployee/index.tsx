"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetImportedEmployees,
  setImportedEmployees,
} from "@/store/slices/employeeSlice";
import type { IEmployees } from "@/types/employees";
import { ImportEmployeeEditRow } from "./ImportEmployeeEditRow";
import ImportEmployeeTable from "./ImportEmployeeTable";
import ImportEmployeeUploadPanel from "./ImportEmployeeUploadPanel";
import { parseImportEmployeeFile } from "./parseImportEmployeeFile";

interface Props {
  onClose: () => void;
  employeepage_instance?: boolean;
}

const ImportEmployee = ({ onClose, employeepage_instance = false }: Props) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const getEditInstance = searchParams.get("edit");
  const getEditIDInstance = searchParams.get("employee_id");

  const employeeData =
    (useAppSelector(
      (state) => state.persistedReducers?.employee?.importedEmployee,
    ) as IEmployees[]) || [];

  const { country } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Remote_Template.xlsx";
    link.download = "Rayda-Remote-Employee-Import-Template.xlsx";
    link.click();
  };

  const onDropFiles = useCallback(
    (files: FileList) => {
      const file = files[0];
      if (!file) return;

      void parseImportEmployeeFile(file, {
        countryName: country?.name,
        onParsed: (employees) => dispatch(setImportedEmployees(employees)),
      });
    },
    [country?.name, dispatch],
  );

  if (Boolean(getEditInstance) && getEditIDInstance) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ImportEmployeeEditRow
          employeeId={getEditIDInstance}
          employeepage_instance={employeepage_instance}
        />
      </div>
    );
  }

  if (employeeData.length > 0) {
    return (
      <ImportEmployeeTable
        onClose={onClose}
        clearArrayData={() => dispatch(resetImportedEmployees())}
        employeepage_instance={employeepage_instance}
        onReupload={() => dispatch(resetImportedEmployees())}
      />
    );
  }

  return (
    <ImportEmployeeUploadPanel
      onDownloadTemplate={handleDownload}
      onDropFiles={onDropFiles}
    />
  );
};

export default ImportEmployee;
