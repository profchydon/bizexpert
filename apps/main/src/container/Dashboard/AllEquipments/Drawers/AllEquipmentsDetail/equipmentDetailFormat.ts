import { IAssetCategory } from "@/types/assets";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value?: string | null): boolean =>
  UUID_REGEX.test((value ?? "").trim());

/**
 * Resolves an equipment `type` into a human-readable name.
 *
 * The API sometimes returns the asset-type id (a UUID) instead of its name.
 * When that happens we map the id back to its name via the asset types list,
 * and never surface a raw UUID to the user.
 */
export const resolveEquipmentType = (
  type?: string | null,
  assetTypes?: Array<Pick<IAssetCategory, "id" | "name">>,
): string | null => {
  const value = (type ?? "").trim();
  if (!value) return null;

  const matched = assetTypes?.find((assetType) => assetType.id === value);
  if (matched?.name) return matched.name;

  return isUuid(value) ? null : value;
};

const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseOtherDetails = (
  otherDetails?: string | string[] | null,
): string[] => {
  if (Array.isArray(otherDetails)) {
    return otherDetails.map((detail) => String(detail).trim()).filter(Boolean);
  }

  const raw = (otherDetails ?? "").trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((detail) => String(detail).trim()).filter(Boolean);
    }
  } catch {
    return [raw];
  }

  return [];
};

/**
 * Builds a clean specification string from the equipment description and any
 * extra detail tags. HTML markup is stripped and empty/`"[]"` values are
 * dropped so the drawer never renders raw markup or an empty array.
 */
export const formatSpecification = ({
  description,
  otherDetails,
}: {
  description?: string | null;
  otherDetails?: string | string[] | null;
}): string => {
  const parts = [
    stripHtml(description ?? ""),
    ...parseOtherDetails(otherDetails),
  ]
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.join(", ");
};

export const parseEquipmentOtherDetailChips = parseOtherDetails;

export const formatEquipmentDescription = (
  description?: string | null,
): string | null => {
  const value = stripHtml(description ?? "");
  return value || null;
};
