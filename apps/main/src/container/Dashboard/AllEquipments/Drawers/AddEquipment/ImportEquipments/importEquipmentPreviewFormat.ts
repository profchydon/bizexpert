export const IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER = "----";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeImportPreviewValue(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }
  return String(value).trim();
}

export function isImportPreviewUuid(value: unknown) {
  const normalized = normalizeImportPreviewValue(value);
  return UUID_PATTERN.test(normalized);
}

export function formatImportAssetSerial(serial?: unknown, rowId?: unknown) {
  const normalized = normalizeImportPreviewValue(serial);
  if (!normalized) return IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER;
  if (isImportPreviewUuid(normalized)) {
    return IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER;
  }
  if (normalizeImportPreviewValue(rowId) === normalized) {
    return IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER;
  }
  return normalized;
}

export function displayImportEquipmentValue(value?: unknown) {
  const normalized = normalizeImportPreviewValue(value);
  return normalized || IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER;
}

export function formatImportMakeModel(make?: unknown, model?: unknown) {
  const parts = [
    normalizeImportPreviewValue(make),
    normalizeImportPreviewValue(model),
  ].filter(Boolean);
  return parts.length > 0
    ? parts.join(" ")
    : IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER;
}

export function formatImportAssetTypeYear(type?: unknown, year?: unknown) {
  const parts = [
    normalizeImportPreviewValue(type),
    normalizeImportPreviewValue(year),
  ].filter(Boolean);
  return parts.length > 0
    ? parts.join(" ")
    : IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER;
}
