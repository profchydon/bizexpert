"use client";

import { useEffect, useState } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import type { Employee } from "../../support/Employees/data/dummy-employees";
import {
  type DirectoryEmployeeFormData,
  updateLocalEmployee,
} from "../../support/Employees/data/employee-directory";

function employeeToFormData(e: Employee): DirectoryEmployeeFormData {
  return {
    name: e.name,
    jobTitle: e.role,
    department: e.dept,
    workEmail: e.email,
    address: e.address,
    country: e.country,
    phone: e.phone ?? "",
  };
}

interface Props {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updated: Employee) => void;
}

export function EditEmployeeSlideout({
  employee,
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const [data, setData] = useState<DirectoryEmployeeFormData | null>(null);

  useEffect(() => {
    if (isOpen && employee) setData(employeeToFormData(employee));
  }, [isOpen, employee]);

  if (!employee || !data) return null;

  const canSave = data.name.trim() !== "" && data.workEmail.trim() !== "";
  const patch = (field: keyof DirectoryEmployeeFormData, value: string) =>
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const save = () => {
    onSaved(updateLocalEmployee(employee.id, data));
    onClose();
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Edit employee</h2>
        <p className="mt-1 text-sm text-tertiary">
          Update {employee.name}&apos;s details — changes save to your employee
          directory.
        </p>
      </SlideoutMenu.Header>
      <SlideoutMenu.Content>
        <div className="flex flex-col gap-4">
          <Input
            label="Full name"
            value={data.name}
            onChange={(value) => patch("name", value)}
            data-testid="editemployeeslideout-input"
          />
          <Input
            label="Work email"
            value={data.workEmail}
            onChange={(value) => patch("workEmail", value)}
            data-testid="editemployeeslideout-input-2"
          />
          <Input
            label="Phone"
            value={data.phone}
            onChange={(value) => patch("phone", value)}
            data-testid="editemployeeslideout-input-3"
          />
          <Input
            label="Job title"
            value={data.jobTitle}
            onChange={(value) => patch("jobTitle", value)}
            data-testid="editemployeeslideout-input-4"
          />
          <Input
            label="Department"
            value={data.department}
            onChange={(value) => patch("department", value)}
            data-testid="editemployeeslideout-input-5"
          />
          <Input
            label="Country"
            value={data.country}
            onChange={(value) => patch("country", value)}
            data-testid="editemployeeslideout-input-6"
          />
          <TextArea
            label="Address"
            value={data.address}
            onChange={(value) => patch("address", value)}
          />
        </div>
      </SlideoutMenu.Content>
      <SlideoutMenu.Footer>
        <div className="flex items-center justify-end gap-3">
          <Button
            color="secondary"
            onClick={onClose}
            data-testid="editemployeeslideout-button"
          >
            Cancel
          </Button>
          <Button
            isDisabled={!canSave}
            onClick={save}
            data-testid="editemployeeslideout-button-2"
          >
            Save changes
          </Button>
        </div>
      </SlideoutMenu.Footer>
    </SlideoutMenu>
  );
}
