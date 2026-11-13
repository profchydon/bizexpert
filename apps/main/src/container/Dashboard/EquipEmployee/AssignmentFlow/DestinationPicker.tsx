import { useMemo, type Key } from "react";
import { Building02, Package, Plus } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { getInitials } from "@/utils/getInitials";
import type { Office } from "@/container/Dashboard/Accounts/types";
import {
  ADD_EMPLOYEE_OPTION,
  buildDestinationOptions,
  destinationForOption,
  optionKeyFor,
} from "./destinationItems";
import type { AssignmentDestination, EmployeeOption } from "./types";

interface DestinationPickerProps {
  destination?: AssignmentDestination | null;
  employees: EmployeeOption[];
  offices: Office[];
  contacts: Record<
    string,
    { contactEmployeeId: string; contactEmployeeName: string }
  >;
  countryLabel?: string;
  countryCode?: string;
  ariaLabel?: string;
  placeholder?: string;
  isWarning?: boolean;
  onAssign: (destination: AssignmentDestination) => void;
  onAddEmployeeAction?: () => void;
}

const DestinationPicker: React.FC<DestinationPickerProps> = ({
  destination,
  employees,
  offices,
  contacts,
  countryLabel,
  countryCode,
  ariaLabel = "Person, office or storage",
  placeholder = "Person, office or storage",
  isWarning,
  onAssign,
  onAddEmployeeAction,
}) => {
  const options = useMemo(
    () =>
      buildDestinationOptions(employees, offices, countryLabel, countryCode),
    [employees, offices, countryLabel, countryCode],
  );
  const selectedPerson =
    destination?.type === "employee"
      ? employees.find((item) => item.id === destination.employeeId)
      : undefined;

  const handleChange = (key: Key | null) => {
    if (!key) return;
    const id = String(key);
    if (id === ADD_EMPLOYEE_OPTION) {
      onAddEmployeeAction?.();
      return;
    }
    const next = destinationForOption(id, employees, offices, contacts);
    if (next) onAssign(next);
  };

  const icon = selectedPerson ? (
    <Avatar
      size="xs"
      initials={getInitials(selectedPerson.name || "") ?? undefined}
    />
  ) : destination?.type === "office" ? (
    Building02
  ) : destination?.type === "storage" ? (
    Package
  ) : undefined;

  return (
    <Select.ComboBox
      aria-label={ariaLabel}
      placeholder={placeholder}
      size="sm"
      shortcut={false}
      icon={icon}
      selectedKey={optionKeyFor(destination)}
      onSelectionChange={handleChange}
      hideSelectedSupportingText
      className="w-full"
      popoverClassName="min-w-[400px]"
      groupClassName={isWarning ? "ring-1 ring-warning-300" : undefined}
    >
      {[
        onAddEmployeeAction ? (
          <Select.Section key="add">
            <SelectItem
              id={ADD_EMPLOYEE_OPTION}
              label="Add employee"
              icon={Plus}
            />
          </Select.Section>
        ) : null,
        options.people.length > 0 ? (
          <Select.Section key="people" header="People">
            {options.people.map((item) => (
              <SelectItem key={item.id} {...item} />
            ))}
          </Select.Section>
        ) : null,
        options.offices.length > 0 ? (
          <Select.Section key="offices" header="Offices">
            {options.offices.map((item) => (
              <SelectItem key={item.id} {...item} />
            ))}
          </Select.Section>
        ) : null,
        <Select.Section key="storage" header="Hold in stock">
          <SelectItem key={options.storage.id} {...options.storage} />
        </Select.Section>,
      ]}
    </Select.ComboBox>
  );
};

export default DestinationPicker;
