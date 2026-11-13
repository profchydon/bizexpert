export type JobTitleOption = {
  value: string;
  label: string;
};

export function jobTitlesToOptions(payload: unknown): JobTitleOption[] {
  return optionItems(payload).flatMap((item) => {
    const title = stringValue(item);
    if (title) return [{ value: title, label: title }];
    if (!isRecord(item)) return [];
    const value = stringValue(item.id ?? item.value ?? item.uuid);
    const label = stringValue(item.name ?? item.title ?? item.job_title);
    return value && label ? [{ value, label }] : [];
  });
}

function optionItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  const data = payload.data;
  if (Array.isArray(data)) return data;
  if (isRecord(data) && Array.isArray(data.data)) return data.data;
  if (Array.isArray(payload.job_titles)) return payload.job_titles;
  if (Array.isArray(payload.roles)) return payload.roles;
  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}
