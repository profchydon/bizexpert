"use client";

import { User01 } from "@untitledui/icons";
import { Select } from "@/components/base/select/select";
import type { SingleSelectValue } from "@/components/ui/autocomplete";
import { equipmentTableEmployeeControlClass } from "../equipmentTableClasses";

type EmployeeOption = {
  value: string;
  label: string;
};

type Props = {
  options: EmployeeOption[];
  selectedOption: SingleSelectValue | null;
  onChange: (value: SingleSelectValue | null) => void;
};

const EquipmentTableEmployeeSelect = ({
  options,
  selectedOption,
  onChange,
}: Props) => {
  const items = options.map((option) => ({
    id: option.value,
    label: option.label,
  }));

  return (
    <Select.ComboBox
      size="sm"
      placeholder="Select employee"
      shortcut={false}
      items={items}
      selectedKey={selectedOption?.value ?? null}
      onSelectionChange={(key) => {
        if (!key) {
          onChange(null);
          return;
        }
        const match = options.find((option) => option.value === String(key));
        if (!match) {
          onChange(null);
          return;
        }
        onChange({ value: match.value, label: match.label });
      }}
      icon={User01}
      className={equipmentTableEmployeeControlClass}
      data-testid="allequipmentstableheader-autocomplete"
    >
      {(item) => <Select.Item {...item} />}
    </Select.ComboBox>
  );
};

export default EquipmentTableEmployeeSelect;
