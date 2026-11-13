"use client";

import { Avatar } from "@/components/base/avatar/avatar";
import { Select } from "@/components/base/select/select";
import { useLineManagerSelectItems } from "./useLineManagerSelectItems";

type Props = {
  value?: string | null;
  selectedLabel?: string;
  excludeEmployeeId?: string;
  onChange: (value: string) => void;
};

export default function EditEmployeeLineManagerField({
  value,
  selectedLabel,
  excludeEmployeeId,
  onChange,
}: Props) {
  const { items, setQuery, isFetching } = useLineManagerSelectItems(
    excludeEmployeeId,
    { id: value, label: selectedLabel },
  );

  const selected = items.find((item) => item.id === value);
  const icon = selected?.initials ? (
    <Avatar size="xs" initials={selected.initials} alt={selected.label} />
  ) : undefined;

  return (
    <Select.ComboBox
      label="Line Manager"
      size="md"
      placeholder="Select line manager"
      shortcut={false}
      items={items}
      selectedKey={value || null}
      onSelectionChange={(key) => onChange(key ? String(key) : "")}
      onSearchChange={setQuery}
      hideSelectedSupportingText
      icon={icon}
      isDisabled={isFetching && items.length === 0}
    >
      {(item) => <Select.Item {...item} />}
    </Select.ComboBox>
  );
}
