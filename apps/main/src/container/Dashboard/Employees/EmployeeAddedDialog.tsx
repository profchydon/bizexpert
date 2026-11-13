"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IEmployees } from "@/types/employees";
import { employeeDisplayName } from "./employeeAddedDialogUtils";

interface EmployeeAddedDialogProps {
  employee: IEmployees | null;
  isOpen: boolean;
  onAddAnother: () => void;
  onClose: () => void;
  onViewEmployee: () => void;
  isViewEmployeeLoading?: boolean;
}

export default function EmployeeAddedDialog({
  employee,
  isOpen,
  onAddAnother,
  onClose,
  onViewEmployee,
  isViewEmployeeLoading = false,
}: EmployeeAddedDialogProps) {
  const employeeName = employeeDisplayName(employee);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-testid="employeeaddeddialog-dialog"
    >
      <DialogContent className="max-w-[420px] gap-5 p-6">
        <DialogHeader className="items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success-50 text-success-600">
            <CheckCircle2 className="size-6" />
          </span>
          <DialogTitle className="pt-2 text-xl text-gray-900">
            Employee added
          </DialogTitle>
          <DialogDescription className="max-w-sm text-sm leading-6 text-gray-500">
            {employeeName} has been added successfully. You can view their
            profile or add another employee.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-[1fr_1fr_1.15fr] sm:space-x-0">
          <Button
            variant="outline"
            className="h-11 w-full border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            onClick={onClose}
            data-testid="employeeaddeddialog-button"
          >
            Close
          </Button>
          <Button
            variant="secondary"
            className="h-11 w-full bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            onClick={onAddAnother}
            data-testid="employeeaddeddialog-button-2"
          >
            Add another
          </Button>
          <Button
            className="h-11 w-full text-sm font-semibold"
            isLoading={isViewEmployeeLoading}
            onClick={onViewEmployee}
            data-testid="employeeaddeddialog-button-3"
          >
            View employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
