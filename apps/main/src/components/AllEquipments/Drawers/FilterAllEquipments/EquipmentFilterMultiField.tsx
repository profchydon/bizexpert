"use client";

import { useListData } from "react-stately";
import { MultiSelect } from "@/components/base/select/multi-select";
import type { SelectItemType } from "@/components/base/select/select";
import type { MultiSelectValue } from "@/components/ui/autocomplete";

type Props = {
  label: string;
  placeholder: string;
  items: SelectItemType[];
  selected: MultiSelectValue;
  onChange: (next: MultiSelectValue) => void;
};

const toMultiSelectValue = (
  ids: string[],
  items: SelectItemType[],
): MultiSelectValue =>
  ids.map((id) => {
    const item = items.find((entry) => String(entry.id) === id);
    return { value: id, label: item?.label ?? id };
  });

export function EquipmentFilterMultiField({
  label,
  placeholder,
  items,
  selected,
  onChange,
}: Props) {
  const selectedItems = useListData<SelectItemType>({
    initialItems: items.filter((item) =>
      (selected ?? []).some((entry) => entry.value === String(item.id)),
    ),
  });

  const currentIds = () => selectedItems.items.map((item) => String(item.id));

  const syncIds = (ids: string[]) => onChange(toMultiSelectValue(ids, items));

  return (
    <MultiSelect
      label={label}
      size="sm"
      placeholder={placeholder}
      items={items}
      selectedItems={selectedItems}
      onItemInserted={(key) => syncIds([...currentIds(), String(key)])}
      onItemCleared={(key) =>
        syncIds(currentIds().filter((id) => id !== String(key)))
      }
    >
      {(item) => <MultiSelect.Item id={item.id}>{item.label}</MultiSelect.Item>}
    </MultiSelect>
  );
}
