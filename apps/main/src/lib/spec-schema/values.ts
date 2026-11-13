import { getSchemaFor, getUniversalSection } from "./registry";
import type {
  SpecField,
  SpecSchemaEntry,
  SpecSection,
  SpecValue,
  SpecValues,
} from "./types";

export function createEmptySpecValues(): SpecValues {
  return {};
}

function collectFieldsForSchema(
  entry: SpecSchemaEntry | null,
  values: SpecValues,
): SpecField[] {
  const fields: SpecField[] = [...getUniversalSection().fields];
  if (!entry) return fields;
  if (entry.sections) {
    for (const section of entry.sections) fields.push(...section.fields);
  }
  if (entry.subtypeField) {
    const subtypeValue = values[entry.subtypeField.id];
    const activeSubtype =
      typeof subtypeValue === "string"
        ? entry.subtypes?.find((s) => s.id === subtypeValue)
        : undefined;
    if (activeSubtype)
      for (const section of activeSubtype.sections)
        fields.push(...section.fields);
  }
  return fields;
}

export function getVisibleSections(
  schemaId: string | null,
  values: SpecValues,
): SpecSection[] {
  const entry = getSchemaFor(schemaId);
  const sections: SpecSection[] = [getUniversalSection()];
  if (!entry) return sections;
  if (entry.sections) sections.push(...entry.sections);
  if (entry.subtypeField) {
    const subtypeValue = values[entry.subtypeField.id];
    const activeSubtype =
      typeof subtypeValue === "string"
        ? entry.subtypes?.find((s) => s.id === subtypeValue)
        : undefined;
    if (activeSubtype) sections.push(...activeSubtype.sections);
  }
  return sections;
}

export function resetSpecsOnAssetTypeChange(
  prev: SpecValues,
  prevSchemaId: string | null,
  nextSchemaId: string | null,
): SpecValues {
  const nextEntry = getSchemaFor(nextSchemaId);
  const nextFields = collectFieldsForSchema(nextEntry, prev);
  const validIds = new Set<string>();
  for (const f of nextFields) {
    validIds.add(f.id);
    validIds.add(`${f.id}_other`);
  }
  if (nextEntry?.subtypeField) {
    validIds.add(nextEntry.subtypeField.id);
    validIds.add(`${nextEntry.subtypeField.id}_other`);
  }
  const next: SpecValues = {};
  for (const [key, value] of Object.entries(prev)) {
    if (validIds.has(key)) next[key] = value;
  }
  return next;
}

function findFieldById(
  schemaId: string | null,
  values: SpecValues,
  fieldId: string,
): SpecField | null {
  const entry = getSchemaFor(schemaId);
  const fields = collectFieldsForSchema(entry, values);
  return fields.find((f) => f.id === fieldId) ?? null;
}

function labelForValue(
  field: SpecField,
  raw: SpecValue,
  otherText: string | null,
): string {
  if (raw === null || raw === undefined || raw === "") return "";
  if (Array.isArray(raw)) {
    const labels = raw.map(
      (id) => field.options?.find((o) => o.id === id)?.label ?? id,
    );
    if (otherText) labels.push(otherText);
    return labels.join(", ");
  }
  if (typeof raw === "number")
    return field.unit ? `${raw} ${field.unit}` : String(raw);
  if (raw === "__other__" && otherText) return otherText;
  const match = field.options?.find((o) => o.id === raw);
  if (match) return match.label;
  return String(raw);
}

export function getSpecLabel(
  schemaId: string | null,
  values: SpecValues,
  fieldId: string,
): { label: string; value: string } | null {
  const field = findFieldById(schemaId, values, fieldId);
  if (!field) return null;
  const raw = values[fieldId];
  const otherText =
    typeof values[`${fieldId}_other`] === "string"
      ? (values[`${fieldId}_other`] as string)
      : null;
  const value = labelForValue(field, raw, otherText);
  if (!value) return null;
  return {
    label:
      field.label +
      (field.unit && !value.includes(field.unit) ? ` (${field.unit})` : ""),
    value,
  };
}

export function enumerateSpecLabels(
  schemaId: string | null,
  values: SpecValues,
): { label: string; value: string }[] {
  const entry = getSchemaFor(schemaId);
  const fields = collectFieldsForSchema(entry, values);
  const out: { label: string; value: string }[] = [];
  for (const field of fields) {
    const resolved = getSpecLabel(schemaId, values, field.id);
    if (resolved) out.push(resolved);
  }
  return out;
}
