"use client";

import { useEffect } from "react";
import type { Key } from "react-aria-components";
import { useListData } from "react-stately";
import { Input } from "@/components/base/input/input";
import { InputNumber } from "@/components/base/input/input-number";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { TagSelect } from "@/components/base/select/tag-select";
import { TextArea } from "@/components/base/textarea/textarea";
import type {
  SpecField,
  SpecOption,
  SpecValue,
  SpecValues,
} from "@/lib/spec-schema";
import { OTHER_VALUE } from "@/lib/spec-schema";

interface Props {
  field: SpecField;
  values: SpecValues;
  onChange: (next: SpecValues) => void;
  isRequired?: boolean;
}

function fieldLabel(field: SpecField): string {
  return field.unit ? `${field.label} (${field.unit})` : field.label;
}

function withOther(options: SpecOption[] | undefined): SelectItemType[] {
  const base = (options ?? []).map((o) => ({ id: o.id, label: o.label }));
  return [...base, { id: OTHER_VALUE, label: "Other…" }];
}

function writeValue(
  values: SpecValues,
  id: string,
  value: SpecValue,
): SpecValues {
  const next = { ...values };
  if (
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    next[id] = null;
  } else {
    next[id] = value;
  }
  return next;
}

function clearOther(values: SpecValues, id: string): SpecValues {
  if (!(`${id}_other` in values)) return values;
  const next = { ...values };
  delete next[`${id}_other`];
  return next;
}

function SelectInput({ field, values, onChange, isRequired }: Props) {
  const items = field.allowOther
    ? withOther(field.options)
    : (field.options ?? []).map((o) => ({ id: o.id, label: o.label }));
  const selectedKey =
    typeof values[field.id] === "string" ? (values[field.id] as string) : null;
  return (
    <Select
      items={items}
      label={fieldLabel(field)}
      placeholder={field.placeholder ?? "Select"}
      size="sm"
      hint={field.helpText}
      tooltip={field.tooltip}
      isRequired={isRequired}
      selectedKey={selectedKey}
      onSelectionChange={(key) => {
        const nextKey = key as string | null;
        let next = writeValue(values, field.id, nextKey);
        if (nextKey !== OTHER_VALUE) next = clearOther(next, field.id);
        onChange(next);
      }}
      data-testid="specfieldinput-select"
    >
      {(item) => (
        <Select.Item key={item.id} id={item.id}>
          {item.label}
        </Select.Item>
      )}
    </Select>
  );
}

function ComboBoxInput({ field, values, onChange, isRequired }: Props) {
  const items = field.allowOther
    ? withOther(field.options)
    : (field.options ?? []).map((o) => ({ id: o.id, label: o.label }));
  const selectedKey =
    typeof values[field.id] === "string" ? (values[field.id] as string) : null;
  return (
    <Select.ComboBox
      items={items}
      label={fieldLabel(field)}
      placeholder={field.placeholder ?? "Search"}
      size="sm"
      shortcut={false}
      hint={field.helpText}
      tooltip={field.tooltip}
      isRequired={isRequired}
      selectedKey={selectedKey}
      onSelectionChange={(key) => {
        const nextKey = key as string | null;
        let next = writeValue(values, field.id, nextKey);
        if (nextKey !== OTHER_VALUE) next = clearOther(next, field.id);
        onChange(next);
      }}
    >
      {(item: SelectItemType) => (
        <Select.Item key={item.id} id={item.id} label={item.label}>
          {item.label}
        </Select.Item>
      )}
    </Select.ComboBox>
  );
}

function readMultiArray(raw: SpecValue): string[] {
  return Array.isArray(raw)
    ? raw.filter((v): v is string => typeof v === "string")
    : [];
}

function MultiSelectInput({ field, values, onChange, isRequired }: Props) {
  const items = field.allowOther
    ? withOther(field.options)
    : (field.options ?? []).map((o) => ({ id: o.id, label: o.label }));
  const currentArray = readMultiArray(values[field.id]);
  const initialSelected = items.filter((i) => currentArray.includes(i.id));
  const selectedItems = useListData<SelectItemType>({
    initialItems: initialSelected,
  });
  const selectedIds = selectedItems.items.map((i) => i.id);

  useEffect(() => {
    const a = selectedIds.join("|");
    const b = currentArray.join("|");
    if (a === b) return;
    let next = writeValue(
      values,
      field.id,
      selectedIds.length ? selectedIds : null,
    );
    if (!selectedIds.includes(OTHER_VALUE)) next = clearOther(next, field.id);
    onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join("|")]);

  return (
    <TagSelect
      items={items}
      label={fieldLabel(field)}
      placeholder={field.placeholder ?? "Select options"}
      size="sm"
      hint={field.helpText}
      tooltip={field.tooltip}
      isRequired={isRequired}
      selectedItems={selectedItems}
      onItemInserted={(key: Key) => {
        const item = items.find((i) => i.id === key);
        if (!item) return;
        if (!selectedItems.items.some((i) => i.id === item.id))
          selectedItems.append(item);
      }}
      onItemCleared={(key: Key) => {
        if (selectedItems.items.some((i) => i.id === key))
          selectedItems.remove(key);
      }}
    >
      {(item: SelectItemType) => (
        <TagSelect.Item id={item.id} textValue={item.label}>
          {item.label}
        </TagSelect.Item>
      )}
    </TagSelect>
  );
}

function NumberInput({ field, values, onChange, isRequired }: Props) {
  const raw = values[field.id];
  const current =
    typeof raw === "number"
      ? raw
      : typeof raw === "string" && raw !== ""
        ? Number(raw)
        : undefined;
  return (
    <InputNumber
      label={fieldLabel(field)}
      placeholder={field.placeholder}
      size="sm"
      hint={field.helpText}
      isRequired={isRequired}
      minValue={field.numberMin}
      maxValue={field.numberMax}
      value={current ?? undefined}
      onChange={(next) =>
        onChange(
          writeValue(values, field.id, Number.isFinite(next) ? next : null),
        )
      }
    />
  );
}

function TextInput({ field, values, onChange, isRequired }: Props) {
  const current =
    typeof values[field.id] === "string" ? (values[field.id] as string) : "";
  return (
    <Input
      label={fieldLabel(field)}
      placeholder={field.placeholder}
      size="sm"
      hint={field.helpText}
      tooltip={field.tooltip}
      isRequired={isRequired}
      value={current}
      onChange={(next) => onChange(writeValue(values, field.id, next))}
      data-testid="specfieldinput-input"
    />
  );
}

function TextAreaInput({ field, values, onChange, isRequired }: Props) {
  const current =
    typeof values[field.id] === "string" ? (values[field.id] as string) : "";
  return (
    <TextArea
      label={fieldLabel(field)}
      placeholder={field.placeholder}
      rows={3}
      tooltip={field.tooltip}
      isRequired={isRequired}
      value={current}
      onChange={(next) => onChange(writeValue(values, field.id, next))}
    />
  );
}

function OtherInput({ field, values, onChange }: Props) {
  const current =
    typeof values[`${field.id}_other`] === "string"
      ? (values[`${field.id}_other`] as string)
      : "";
  return (
    <Input
      label={`${field.label} (custom)`}
      placeholder={`Describe your ${field.label.toLowerCase()}`}
      size="sm"
      value={current}
      onChange={(next) => {
        const copy = { ...values };
        if (next) copy[`${field.id}_other`] = next;
        else delete copy[`${field.id}_other`];
        onChange(copy);
      }}
      data-testid="specfieldinput-input-2"
    />
  );
}

function showsOtherInput(field: SpecField, values: SpecValues): boolean {
  if (!field.allowOther) return false;
  const raw = values[field.id];
  if (typeof raw === "string") return raw === OTHER_VALUE;
  if (Array.isArray(raw)) return raw.includes(OTHER_VALUE);
  return false;
}

export function SpecFieldInput(props: Props) {
  const { field } = props;
  let node: React.ReactNode = null;
  switch (field.kind) {
    case "select":
      node = <SelectInput {...props} />;
      break;
    case "combobox":
      node = <ComboBoxInput {...props} />;
      break;
    case "multiSelect":
      node = <MultiSelectInput {...props} />;
      break;
    case "number":
      node = <NumberInput {...props} />;
      break;
    case "text":
      node = <TextInput {...props} />;
      break;
    case "textarea":
      node = <TextAreaInput {...props} />;
      break;
  }
  return (
    <div className="flex flex-col gap-2">
      {node}
      {showsOtherInput(field, props.values) && <OtherInput {...props} />}
    </div>
  );
}
