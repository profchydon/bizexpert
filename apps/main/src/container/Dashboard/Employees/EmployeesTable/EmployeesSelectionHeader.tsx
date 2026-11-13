"use client";

import { LogOut01, Package, User01, X } from "@untitledui/icons";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";

type Props = {
  selectedCount: number;
  canOffboard?: boolean;
  offboardDisabledReason?: string;
  onClear: () => void;
  onOffboard?: () => void;
  isOffboardLoading?: boolean;
  onEquip?: () => void;
  isEquipLoading?: boolean;
};

const EmployeesSelectionHeader = ({
  selectedCount,
  canOffboard = true,
  offboardDisabledReason,
  onClear,
  onOffboard,
  isOffboardLoading = false,
  onEquip,
  isEquipLoading = false,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 border-b border-secondary bg-brand-primary_alt px-5 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-md font-semibold text-primary">Employees</h2>
        <BadgeWithIcon color="brand" size="sm" iconLeading={User01}>
          {selectedCount} selected
        </BadgeWithIcon>
        {!canOffboard && offboardDisabledReason ? (
          <span className="text-xs font-medium text-warning-600">
            {offboardDisabledReason}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          color="tertiary"
          size="sm"
          iconLeading={X}
          onClick={onClear}
          data-testid="employeesselectionheader-button"
        >
          Clear
        </Button>
        <Button
          color="secondary"
          size="sm"
          iconLeading={LogOut01}
          isDisabled={!canOffboard}
          isLoading={isOffboardLoading}
          onClick={() => onOffboard?.()}
          data-testid="employeesselectionheader-button-2"
        >
          Off-board Employee
        </Button>
        <Button
          color="primary"
          size="sm"
          iconLeading={Package}
          isLoading={isEquipLoading}
          onClick={() => onEquip?.()}
          data-testid="employeesselectionheader-button-3"
        >
          Equip Employee
        </Button>
      </div>
    </div>
  );
};

export default EmployeesSelectionHeader;
