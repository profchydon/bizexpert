"use client";

import { useMemo, useState } from "react";
import { Select, type SelectItemType } from "@/components/base/select/select";
import {
  buildCreatableSelectItems,
  EMPTY_CREATABLE_SELECT_ID,
  parseCreateSelectKey,
} from "./buildCreatableSelectItems";
import { withCurrentSelectOption } from "./editEmployeeFormOptions";
import {
  type CreatedSelectOption,
  createdSelectOptionLabel,
  mergeCreatedSelectOption,
} from "./mergeCreatedSelectOption";

type Props = {
  label: string;
  placeholder: string;
  items: SelectItemType[];
  selectedKey: string;
  onSelect: (value: string) => void;
  onCreate: (name: string) => Promise<string | null>;
  isCreating?: boolean;
  emptyLabel: string;
};

export function CreatableNamedComboBox({
  label,
  placeholder,
  items,
  selectedKey,
  onSelect,
  onCreate,
  isCreating = false,
  emptyLabel,
}: Readonly<Props>) {
  const [query, setQuery] = useState("");
  const [createdOption, setCreatedOption] =
    useState<CreatedSelectOption | null>(null);
  const options = useMemo(() => {
    const labeledItems = mergeCreatedSelectOption(items, createdOption);
    const selectedLabel = createdSelectOptionLabel(
      labeledItems,
      selectedKey,
      createdOption,
    );
    return withCurrentSelectOption(
      buildCreatableSelectItems(labeledItems, query, emptyLabel),
      selectedKey,
      selectedLabel,
    );
  }, [createdOption, emptyLabel, items, query, selectedKey]);

  return (
    <Select.ComboBox
      label={label}
      placeholder={placeholder}
      shortcut={false}
      icon={null}
      isDisabled={isCreating}
      allowsEmptyCollection
      defaultFilter={() => true}
      items={options}
      selectedKey={selectedKey || null}
      onSearchChange={setQuery}
      onSelectionChange={(key) => {
        const value = key ? String(key) : "";
        if (value === EMPTY_CREATABLE_SELECT_ID) return;
        const createdName = parseCreateSelectKey(value);
        if (!createdName) {
          onSelect(value);
          return;
        }

        void onCreate(createdName).then((createdId) => {
          if (!createdId) {
            return;
          }
          setCreatedOption({ id: createdId, label: createdName });
          setQuery("");
          onSelect(createdId);
        });
      }}
    >
      {(item) => <Select.Item {...item} />}
    </Select.ComboBox>
  );
}
