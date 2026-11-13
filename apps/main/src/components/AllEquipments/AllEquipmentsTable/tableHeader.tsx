"use client";

import React from "react";
import { FilterLines, SearchMd } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import {
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/base/button-group/button-group";
import { Input } from "@/components/base/input/input";
import type { SingleSelectValue } from "@/components/ui/autocomplete";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import {
  equipmentTableControlClass,
  equipmentTableControlsClass,
  equipmentTableControlsRowClass,
  equipmentTableEmployeeControlClass,
  equipmentTableTitleClass,
  equipmentTableTitleGroupClass,
  equipmentTableTitleRowClass,
} from "../equipmentTableClasses";
import EquipmentTableEmployeeSelect from "./EquipmentTableEmployeeSelect";
import EquipmentTableSelectionActions from "./EquipmentTableSelectionActions";

interface FormattedItem {
  value: string;
  label: string;
}

interface Props {
  selectedValue: string;
  onHandleChange: (value: string) => void;
  searchValue: string | null;
  setSearch: (value: string) => void;
  equipmentsLength: string | number;
  toggleFilterEquipments: () => void;
  employeeDataOptions: FormattedItem[];
  setSelectedEmployeeValue: (value: SingleSelectValue | null) => void;
  selectedOption: SingleSelectValue | null;
  selectedRows?: any[];
  onReset: () => void;
  multipleSelectBtnActions: {
    onTransfer: () => void;
    onStore: () => void;
    onSell: () => void;
    onDispose: () => void;
    onRefreshStore: () => void;
  };
  removeFilterButton?: boolean;
  isDeviceRefreshEquipment?: boolean;
  isDeviceRefresh?: boolean;
}

const TableHeader: React.FC<Props> = ({
  selectedValue,
  onHandleChange,
  searchValue,
  setSearch,
  equipmentsLength,
  toggleFilterEquipments,
  employeeDataOptions,
  setSelectedEmployeeValue,
  selectedOption,
  multipleSelectBtnActions,
  selectedRows,
  onReset,
  removeFilterButton,
  isDeviceRefreshEquipment,
  isDeviceRefresh,
}) => (
  <>
    <div className={equipmentTableTitleRowClass}>
      <div className={equipmentTableTitleGroupClass}>
        <p className={equipmentTableTitleClass}>Equipment</p>
        <Badge size="sm" color="brand">
          {equipmentsLength} Equipment
        </Badge>
      </div>
      <EquipmentTableSelectionActions
        selectedRows={selectedRows}
        multipleSelectBtnActions={multipleSelectBtnActions}
        isDeviceRefreshEquipment={isDeviceRefreshEquipment}
        isDeviceRefresh={isDeviceRefresh}
      />
    </div>

    <div className={equipmentTableControlsRowClass}>
      <ButtonGroup
        size="sm"
        selectionMode="single"
        selectedKeys={new Set([selectedValue])}
        disallowEmptySelection
        onSelectionChange={(keys) => {
          const next = Array.from(keys)[0];
          if (typeof next === "string") onHandleChange(next);
        }}
      >
        {["all", "Rayda", "External"].map((item) => (
          <ButtonGroupItem key={item} id={item} className="h-10">
            {capitalizeFirstLetter(item)}
          </ButtonGroupItem>
        ))}
      </ButtonGroup>

      <div className={equipmentTableControlsClass}>
        <Input
          size="sm"
          icon={SearchMd}
          placeholder="Search"
          value={searchValue ?? ""}
          onChange={setSearch}
          aria-label="Search equipment"
          className={equipmentTableControlClass}
          wrapperClassName="h-10"
          data-testid="allequipmentstableheader-input"
        />
        <EquipmentTableEmployeeSelect
          options={employeeDataOptions}
          selectedOption={selectedOption}
          onChange={setSelectedEmployeeValue}
        />
        {!removeFilterButton ? (
          <Button
            color="secondary"
            size="sm"
            iconLeading={FilterLines}
            className="h-10 shrink-0"
            onClick={toggleFilterEquipments}
            data-testid="allequipmentstableheader-button"
          >
            Filters
          </Button>
        ) : null}
        <Button
          color="secondary"
          size="sm"
          className="h-10 shrink-0"
          onClick={onReset}
          data-testid="allequipmentstableheader-button-2"
        >
          Reset
        </Button>
      </div>
    </div>
  </>
);

export default TableHeader;
