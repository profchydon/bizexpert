"use client";

import type { Key } from "react";
import { Plus } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import type { Employee } from "../../Employees/data/dummy-employees";
import {
  buildEmployeeGroups,
  buildSortedEmployeeItems,
} from "../utils/employeeItems";

const ADD_EMPLOYEE_OPTION_ID = "add_employee";

interface EmployeePickerProps {
  selectedId: string | null;
  employees: Employee[];
  deviceCountry?: string;
  onSelect: (employeeId: string, employeeName: string) => void;
  onAddEmployeeAction?: () => void;
  showAddEmployeeAction?: boolean;
  isDisabled?: boolean;
  isWarning?: boolean;
  allowCrossCountryFallback?: boolean;
}

function EmployeePicker({
  selectedId,
  employees,
  deviceCountry = "",
  onSelect,
  onAddEmployeeAction,
  showAddEmployeeAction = true,
  isDisabled,
  isWarning,
  allowCrossCountryFallback = false,
}: EmployeePickerProps) {
  // Cross-country pickers (e.g. Deploy to employee) list every employee, grouped by
  // country with the device's country first and a divider per country. Other pickers
  // keep the original flat, local-only list.
  const groups = allowCrossCountryFallback
    ? buildEmployeeGroups(deviceCountry, employees)
    : [];
  const localItems = allowCrossCountryFallback
    ? []
    : buildSortedEmployeeItems(deviceCountry, employees);
  const flatItems = showAddEmployeeAction
    ? [
        { id: ADD_EMPLOYEE_OPTION_ID, label: "Add Employee", icon: Plus },
        ...localItems,
      ]
    : localItems;

  const lookup = allowCrossCountryFallback
    ? groups.flatMap((g) => g.items)
    : localItems;
  const showHeaders = groups.length > 1;

  const handleChange = (key: Key | null) => {
    if (!key) return;
    if (String(key) === ADD_EMPLOYEE_OPTION_ID) {
      onAddEmployeeAction?.();
      return;
    }
    const emp = lookup.find((e) => e.id === String(key));
    if (emp) onSelect(emp.id, emp.label ?? "");
  };

  const selectedEmp = selectedId
    ? lookup.find((e) => e.id === selectedId)
    : null;
  const icon = selectedEmp ? (
    <Avatar size="xs" initials={selectedEmp.initials ?? ""} />
  ) : undefined;

  return (
    <Select.ComboBox
      aria-label="Assign employee"
      placeholder="Select employee"
      size="sm"
      shortcut={false}
      icon={icon}
      items={allowCrossCountryFallback ? undefined : flatItems}
      selectedKey={selectedId}
      onSelectionChange={handleChange}
      hideSelectedSupportingText
      isDisabled={isDisabled}
      className="w-full min-w-[200px]"
      popoverClassName="min-w-[320px]"
      groupClassName={isWarning ? "ring-1 ring-[#fec84b]" : undefined}
    >
      {allowCrossCountryFallback
        ? [
            showAddEmployeeAction && (
              <Select.Section key="add">
                <SelectItem
                  id={ADD_EMPLOYEE_OPTION_ID}
                  label="Add Employee"
                  icon={Plus}
                />
              </Select.Section>
            ),
            ...groups.map((group) => (
              <Select.Section
                key={group.country || "all"}
                header={showHeaders ? group.country : undefined}
              >
                {group.items.map((item) => (
                  <SelectItem key={item.id} {...item} />
                ))}
              </Select.Section>
            )),
          ]
        : (item) => <SelectItem key={item.id} {...item} />}
    </Select.ComboBox>
  );
}

export { EmployeePicker };
