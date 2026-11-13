"use client";

import { Plus, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import type {
  SpecField,
  SpecSection,
  SpecSubtype,
  SpecValues,
} from "@/lib/spec-schema";
import { getSchemaFor, getUniversalSection } from "@/lib/spec-schema";
import { SpecFieldInput } from "./SpecFieldInput";

interface Props {
  schemaId: string | null;
  values: SpecValues;
  onChange: (next: SpecValues) => void;
  mode?: "rfq" | "vendor";
  forcedSubtype?: string | null;
  showAddPicker?: boolean;
}

interface SectionContext {
  section: SpecSection;
  groupLabel: string;
}

function collectSections(
  schemaId: string | null,
  values: SpecValues,
  forcedSubtype: string | null,
): SectionContext[] {
  const entry = getSchemaFor(schemaId);
  const contexts: SectionContext[] = [
    { section: getUniversalSection(), groupLabel: "General" },
  ];
  if (!entry) return contexts;
  if (entry.sections)
    for (const section of entry.sections)
      contexts.push({ section, groupLabel: entry.label });
  if (entry.subtypeField) {
    const subtypeValue =
      forcedSubtype ??
      (typeof values[entry.subtypeField.id] === "string"
        ? (values[entry.subtypeField.id] as string)
        : null);
    const activeSubtype = subtypeValue
      ? entry.subtypes?.find((s) => s.id === subtypeValue)
      : undefined;
    if (activeSubtype)
      for (const section of activeSubtype.sections)
        contexts.push({ section, groupLabel: activeSubtype.label });
  }
  return contexts;
}

function buildFieldMap(contexts: SectionContext[]): Map<string, SpecField> {
  const map = new Map<string, SpecField>();
  for (const ctx of contexts)
    for (const field of ctx.section.fields) map.set(field.id, field);
  return map;
}

function getActiveFieldIds(
  values: SpecValues,
  fieldMap: Map<string, SpecField>,
  excludeIds: Set<string>,
): string[] {
  return Object.keys(values).filter((key) => {
    if (key.endsWith("_other")) return false;
    if (excludeIds.has(key)) return false;
    return fieldMap.has(key);
  });
}

function initialValueForField(field: SpecField): null | string[] {
  return field.kind === "multiSelect" ? [] : null;
}

function removeSpecKey(values: SpecValues, fieldId: string): SpecValues {
  const next = { ...values };
  delete next[fieldId];
  delete next[`${fieldId}_other`];
  return next;
}

function ActiveSpecRow({
  field,
  values,
  onChange,
  onRemove,
  isRequired,
}: {
  field: SpecField;
  values: SpecValues;
  onChange: (next: SpecValues) => void;
  onRemove?: () => void;
  isRequired?: boolean;
}) {
  return (
    <div className="group flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <SpecFieldInput
          field={field}
          values={values}
          onChange={onChange}
          isRequired={isRequired}
        />
      </div>
      {onRemove && (
        <Button
          color="tertiary"
          size="sm"
          iconLeading={<Trash01 data-icon />}
          onClick={onRemove}
          aria-label={`Remove ${field.label}`}
          className="opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
          data-testid="specfieldsrenderer-button"
        />
      )}
    </div>
  );
}

function SubtypeSelector({
  schemaId,
  values,
  onChange,
  mode,
}: {
  schemaId: string;
  values: SpecValues;
  onChange: (next: SpecValues) => void;
  mode: "rfq" | "vendor";
}) {
  const entry = getSchemaFor(schemaId);
  const subtypeField = entry?.subtypeField;
  if (!subtypeField) return null;
  const field: SpecField = {
    id: subtypeField.id,
    label: subtypeField.label,
    kind: "select",
    options: subtypeField.options,
    requiredForVendor: true,
  };
  return (
    <SpecFieldInput
      field={field}
      values={values}
      onChange={onChange}
      isRequired={mode === "vendor"}
    />
  );
}

function AddSpecPicker({
  groups,
  onPick,
  resetKey,
}: {
  groups: { label: string; fields: SpecField[] }[];
  onPick: (fieldId: string) => void;
  resetKey: number;
}) {
  const hasOptions = groups.some((g) => g.fields.length > 0);
  if (!hasOptions) {
    return (
      <p className="rounded-lg border border-dashed border-secondary px-4 py-3 text-center text-xs text-tertiary">
        All available specs have been added.
      </p>
    );
  }
  return (
    <Select.ComboBox
      key={resetKey}
      label="Add a spec"
      placeholder="Search for a spec to add…"
      size="sm"
      shortcut={false}
      selectedKey={null}
      icon={Plus}
      onSelectionChange={(key) => {
        if (!key) return;
        onPick(String(key));
      }}
    >
      {groups
        .filter((g) => g.fields.length > 0)
        .map((group) => (
          <Select.Section key={group.label} header={group.label}>
            {group.fields.map((f) => (
              <Select.Item key={f.id} id={f.id} label={f.label} />
            ))}
          </Select.Section>
        ))}
    </Select.ComboBox>
  );
}

export function SpecFieldsRenderer({
  schemaId,
  values,
  onChange,
  mode = "rfq",
  forcedSubtype = null,
  showAddPicker = true,
}: Props) {
  if (!schemaId) {
    return (
      <p className="rounded-lg border border-dashed border-secondary px-4 py-6 text-center text-sm text-tertiary">
        Pick an asset type to add specs.
      </p>
    );
  }

  const entry = getSchemaFor(schemaId);
  const subtypeField = entry?.subtypeField;
  const showSubtypeSelector = Boolean(subtypeField) && !forcedSubtype;
  const contexts = collectSections(schemaId, values, forcedSubtype);
  const fieldMap = buildFieldMap(contexts);
  const excluded = new Set<string>(subtypeField ? [subtypeField.id] : []);
  const activeIds = getActiveFieldIds(values, fieldMap, excluded);

  const pickerGroups = contexts.map((ctx) => ({
    label: ctx.section.title,
    fields: ctx.section.fields.filter(
      (f) =>
        !activeIds.includes(f.id) &&
        !excluded.has(f.id) &&
        (f.showIf ? f.showIf(values) : true),
    ),
  }));

  if (!showSubtypeSelector && activeIds.length === 0 && !showAddPicker) {
    return null;
  }

  function handlePick(fieldId: string) {
    const field = fieldMap.get(fieldId);
    if (!field) return;
    if (fieldId in values) return;
    onChange({ ...values, [fieldId]: initialValueForField(field) });
  }

  function handleRemove(fieldId: string) {
    onChange(removeSpecKey(values, fieldId));
  }

  return (
    <div className="flex flex-col gap-4">
      {showSubtypeSelector && (
        <SubtypeSelector
          schemaId={schemaId}
          values={values}
          onChange={onChange}
          mode={mode}
        />
      )}
      {activeIds.length > 0 && (
        <div className="flex flex-col gap-3">
          {activeIds.map((id) => {
            const field = fieldMap.get(id);
            if (!field) return null;
            return (
              <ActiveSpecRow
                key={id}
                field={field}
                values={values}
                onChange={onChange}
                onRemove={() => handleRemove(id)}
                isRequired={mode === "vendor" ? field.requiredForVendor : false}
              />
            );
          })}
        </div>
      )}
      {showAddPicker && (
        <AddSpecPicker
          groups={pickerGroups}
          onPick={handlePick}
          resetKey={activeIds.length}
        />
      )}
    </div>
  );
}
