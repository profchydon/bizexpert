"use client";

import { useState } from "react";
import {
  ChevronDown,
  Copy01,
  LogOut01,
  Mail01,
  Package,
  Trash01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import type { IEmployees } from "@/types/employees";
import { useEquipEmployees } from "../EmployeesTable/useEquipEmployees";
import { useOffboardConfirm } from "../EmployeesTable/useOffboardConfirm";
import DeleteAlertDialogWrapper from "./DeleteAlertDialogWrapper";

type Props = {
  employee?: IEmployees;
  actionsCount?: number;
  companyAdminId?: string;
  deleteLoading?: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onShareInvite: () => void;
  onViewPendingActions?: () => void;
};

const EmployeeDetailViewActions = ({
  employee,
  actionsCount = 0,
  companyAdminId,
  deleteLoading = false,
  onDelete,
  onDuplicate,
  onShareInvite,
  onViewPendingActions,
}: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { equipOne, isRowLoading: isEquipLoading } = useEquipEmployees([]);
  const { offboardOne, isRowLoading: isOffboardLoading } = useOffboardConfirm(
    [],
  );

  if (!employee || employee.status?.toLowerCase() !== "active") return null;

  const employeeId = String(employee.id);
  const isPending = isEquipLoading(employeeId) || isOffboardLoading(employeeId);
  const canDelete = companyAdminId !== employeeId;
  const hasPendingActions = actionsCount > 0;

  return (
    <>
      <Dropdown.Root>
        <Button
          size="md"
          color="secondary"
          iconTrailing={ChevronDown}
          isDisabled={isPending || deleteLoading}
          isLoading={isPending}
          data-testid="employeedetailviewactions-button"
        >
          View actions
        </Button>
        <Dropdown.Popover className="w-60">
          <Dropdown.Menu selectionMode="none">
            <Dropdown.Item
              icon={Package}
              label="Equip employee"
              onAction={() => equipOne(employee)}
            />
            <Dropdown.Item
              icon={LogOut01}
              label="Off-board employee"
              onAction={() => offboardOne(employee)}
            />
            {hasPendingActions ? (
              <Dropdown.Item
                label="Review pending actions"
                addon={String(actionsCount)}
                onAction={() => onViewPendingActions?.()}
              />
            ) : null}
            <Dropdown.Separator />
            <Dropdown.Item
              icon={Mail01}
              label="Share invite"
              onAction={onShareInvite}
            />
            <Dropdown.Item
              icon={Copy01}
              label="Duplicate employee"
              onAction={onDuplicate}
            />
            {canDelete ? (
              <Dropdown.Item
                icon={Trash01}
                label="Delete employee"
                onAction={() => setIsDeleteOpen(true)}
              />
            ) : null}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Root>
      {canDelete ? (
        <DeleteAlertDialogWrapper
          handleContinue={onDelete}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      ) : null}
    </>
  );
};

export default EmployeeDetailViewActions;
