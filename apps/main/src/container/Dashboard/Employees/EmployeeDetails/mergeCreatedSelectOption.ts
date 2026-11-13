import type { SelectItemType } from "@/components/base/select/select";

export type CreatedSelectOption = {
  id: string;
  label: string;
};

export function createdSelectOptionLabel(
  items: SelectItemType[],
  selectedKey: string,
  created: CreatedSelectOption | null,
) {
  if (created?.id === selectedKey && created.label.trim()) {
    return created.label;
  }
  return items.find((item) => item.id === selectedKey)?.label;
}

export function mergeCreatedSelectOption(
  items: SelectItemType[],
  created: CreatedSelectOption | null,
): SelectItemType[] {
  if (!created?.id || !created.label.trim()) {
    return items;
  }

  if (items.some((item) => item.id === created.id)) {
    return items.map((item) =>
      item.id === created.id ? { ...item, label: created.label } : item,
    );
  }

  return [...items, { id: created.id, label: created.label }];
}
