export type RawRecord = Record<string, unknown>;

export function findNestedText(
  source: unknown,
  keys: string[],
  depth = 3,
): string {
  const record = objectValue(source);
  if (!record || depth < 0) return "";
  for (const key of keys) {
    const value = textValue(record[key]);
    if (value) return value;
  }
  for (const value of Object.values(record)) {
    if (Array.isArray(value)) continue;
    const nested = findNestedText(value, keys, depth - 1);
    if (nested) return nested;
  }
  return "";
}

export function objectValue(value: unknown): RawRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RawRecord)
    : undefined;
}

export function firstText(values: unknown[]) {
  return values.map(textValue).find(Boolean) ?? "";
}

export function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isIdLikeValue(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(value.trim());
}

export function employeeName(employee: {
  first_name?: string;
  last_name?: string;
}) {
  return [employee.first_name, employee.last_name].filter(Boolean).join(" ");
}
