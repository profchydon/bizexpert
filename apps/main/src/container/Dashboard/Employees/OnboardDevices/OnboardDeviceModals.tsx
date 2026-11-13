"use client";

import React from "react";
import type { IEmployees } from "@/types/employees";
import AddEmployeesModal from "../OffboardDevices/AddEmployeesModal";
import AddDeviceModal from "./AddDeviceModal";
import type { EquipDeviceItem, EquipEmployeeBasic } from "./equipTypes";

interface Props {
  isAddEmployeeOpen: boolean;
  onAddEmployeeOpenChange: (open: boolean) => void;
  excludeIds: string[];
  onAddEmployees: (employees: IEmployees[]) => void;
  isAddDeviceOpen: boolean;
  onAddDeviceOpenChange: (open: boolean) => void;
  employee: EquipEmployeeBasic;
  countryId?: string;
  currency?: string;
  addedAssetIds: Set<string>;
  unavailableStorageIds: Set<string>;
  onAddDevice: (item: EquipDeviceItem) => void;
}

const OnboardDeviceModals: React.FC<Props> = ({
  isAddEmployeeOpen,
  onAddEmployeeOpenChange,
  excludeIds,
  onAddEmployees,
  isAddDeviceOpen,
  onAddDeviceOpenChange,
  employee,
  countryId,
  currency,
  addedAssetIds,
  unavailableStorageIds,
  onAddDevice,
}) => (
  <>
    <AddEmployeesModal
      isOpen={isAddEmployeeOpen}
      onOpenChange={onAddEmployeeOpenChange}
      excludeIds={excludeIds}
      requireAssignedDevices={false}
      requireCountry
      title="Add employees to equip"
      description="Pick more people to equip. Employees already in this batch aren't shown."
      confirmLabel="Add to equip"
      onAdd={onAddEmployees}
    />

    <AddDeviceModal
      isOpen={isAddDeviceOpen}
      onOpenChange={onAddDeviceOpenChange}
      employee={employee}
      countryId={countryId}
      currency={currency}
      addedAssetIds={addedAssetIds}
      unavailableStorageIds={unavailableStorageIds}
      onAdd={onAddDevice}
    />
  </>
);

export default OnboardDeviceModals;
