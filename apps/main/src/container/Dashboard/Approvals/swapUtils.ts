import type { SwapCatalogOrderRequestPayload } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/types";
import type { ApprovalItem } from "./types";

export const minSwapReasonLength = 5;
export const swapCandidatePageSize = 10;

export type SwapCandidate = {
  amount?: number;
  category?: string;
  categoryId?: string;
  currencySymbol?: string;
  id: string;
  imageUrl?: string;
  leadTimeLabel?: string;
  name: string;
  replacementAssetSpecificationId?: string;
  replacementKitItemId?: string;
  source: "ASSET" | "KIT";
};

export type ApprovalSwapDraft = {
  acknowledgeBudgetWarning: boolean;
  acknowledgeCategoryChange: boolean;
  acknowledgeExistingItem: boolean;
  acknowledgeOutsideKitScope: boolean;
  originalKitItemId: string;
  quantity: number;
  reason: string;
  replacementAssetSpecificationId: string;
  replacementKitItemId: string;
};

export function kitItemsToSwapCandidates(
  raw: unknown,
  filters: {
    categoryId?: string;
    categoryName?: string;
    originalKitItemId?: string;
    search?: string;
  } = {},
): SwapCandidate[] {
  const search = filters.search?.trim().toLowerCase();
  return extractList(raw)
    .filter((entry) => {
      const kitItemId = replacementKitItemId(entry);
      if (!kitItemId || kitItemId === filters.originalKitItemId) return false;
      if (!matchesCategory(entry, filters)) return false;
      if (search && !assetName(entry)?.toLowerCase().includes(search))
        return false;
      return true;
    })
    .flatMap((entry) => {
      const id = replacementKitItemId(entry);
      const name = assetName(entry);
      const replacementAssetSpecificationId = assetSpecificationId(entry);
      if (!id || !name || !replacementAssetSpecificationId) return [];

      const candidate: SwapCandidate = {
        id,
        name,
        replacementAssetSpecificationId,
        replacementKitItemId: id,
        source: "KIT",
      };
      const amount = numberValue(
        entry.asset_pricing?.amount ??
          entry.asset_specification?.asset_pricing?.amount ??
          entry.amount,
      );
      const category = categoryName(entry);
      const categoryIdValue = categoryId(entry);
      const currencySymbol = stringValue(
        entry.asset_pricing?.currency?.symbol ??
          entry.asset_specification?.asset_pricing?.currency?.symbol,
      );
      const image = imageUrl(entry);
      const leadTime = leadTimeLabel(entry);

      if (amount !== undefined) candidate.amount = amount;
      if (category) candidate.category = category;
      if (categoryIdValue) candidate.categoryId = categoryIdValue;
      if (currencySymbol) candidate.currencySymbol = currencySymbol;
      if (image) candidate.imageUrl = image;
      if (leadTime) candidate.leadTimeLabel = leadTime;

      return [candidate];
    });
}

export function assetsToSwapCandidates(
  raw: unknown,
  filters: {
    originalAssetSpecificationId?: string;
    search?: string;
  } = {},
): SwapCandidate[] {
  const search = filters.search?.trim().toLowerCase();
  return extractList(raw)
    .filter((entry) => {
      const specId = assetSpecificationId(entry);
      if (!specId || specId === filters.originalAssetSpecificationId)
        return false;
      if (search && !assetName(entry)?.toLowerCase().includes(search))
        return false;
      return true;
    })
    .flatMap((entry) => {
      const replacementAssetSpecificationId = assetSpecificationId(entry);
      const name = assetName(entry);
      if (!replacementAssetSpecificationId || !name) return [];
      const candidate: SwapCandidate = {
        id: stringValue(entry.id) ?? replacementAssetSpecificationId,
        name,
        replacementAssetSpecificationId,
        replacementKitItemId:
          stringValue(entry.id) ?? replacementAssetSpecificationId,
        source: "ASSET",
      };
      const amount = numberValue(entry.asset_pricing?.amount ?? entry.amount);
      const category = categoryName(entry);
      const categoryIdValue = categoryId(entry);
      const currencySymbol = stringValue(entry.asset_pricing?.currency?.symbol);
      const image = imageUrl(entry);
      const leadTime = leadTimeLabel(entry);

      if (amount !== undefined) candidate.amount = amount;
      if (category) candidate.category = category;
      if (categoryIdValue) candidate.categoryId = categoryIdValue;
      if (currencySymbol) candidate.currencySymbol = currencySymbol;
      if (image) candidate.imageUrl = image;
      if (leadTime) candidate.leadTimeLabel = leadTime;
      return [candidate];
    });
}

export function employeeCountryId(employee: unknown, countries?: unknown) {
  if (!isRecord(employee)) return undefined;
  const country = employee.country;
  const directId =
    stringValue(employee.country_id) ??
    (isRecord(country) ? stringValue(country.id) : undefined);
  if (directId) return directId;

  const countryCode = normalizedText(employee.country_code);
  const countryName =
    typeof country === "string"
      ? normalizedText(country)
      : normalizedText(country?.name);
  const match = extractList(countries).find((item) => {
    const code = normalizedText(item.code ?? item.country_code);
    const name = normalizedText(item.name);
    return Boolean(
      (countryCode && code === countryCode) ||
      (countryName && name === countryName),
    );
  });

  return stringValue(match?.id);
}

export function isSwapDraftValid({
  reason,
  selectedId,
}: {
  reason: string;
  selectedId?: string | null;
}) {
  return Boolean(selectedId && !shouldFocusSwapReason(reason));
}

export function shouldFocusSwapReason(reason: string) {
  return reason.trim().length < minSwapReasonLength;
}

export function nextSwapSelection({
  candidates,
  selectedId,
}: {
  candidates: SwapCandidate[];
  selectedId?: string | null;
}) {
  if (
    selectedId &&
    candidates.some((candidate) => candidate.id === selectedId)
  ) {
    return selectedId;
  }
  return candidates[0]?.id ?? null;
}

export function swapDraftToPayload(
  draft: ApprovalSwapDraft,
): SwapCatalogOrderRequestPayload {
  return {
    acknowledge_budget_warning: draft.acknowledgeBudgetWarning,
    acknowledge_category_change: draft.acknowledgeCategoryChange,
    acknowledge_existing_item: draft.acknowledgeExistingItem,
    acknowledge_outside_kit_scope: draft.acknowledgeOutsideKitScope,
    quantity: draft.quantity,
    reason: draft.reason,
    replacement_asset_specification_id: draft.replacementAssetSpecificationId,
  };
}

export function swapPaginationMeta(raw: unknown) {
  const payload = isRecord(raw) ? raw.data : undefined;
  return {
    currentPage: numberValue(payload?.current_page) ?? 1,
    lastPage: numberValue(payload?.last_page) ?? 1,
  };
}

function extractList(raw: unknown): Record<string, any>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(isRecord);
  if (!isRecord(raw)) return [];

  const data = raw.data;
  if (Array.isArray(data)) return data.filter(isRecord);
  if (isRecord(data) && Array.isArray(data.data))
    return data.data.filter(isRecord);

  const candidate = Object.values(raw).find(Array.isArray);
  return Array.isArray(candidate) ? candidate.filter(isRecord) : [];
}

function assetName(entry: Record<string, any>) {
  return (
    stringValue(entry.name) ??
    stringValue(entry.asset_specification?.name) ??
    stringValue(entry.asset?.name) ??
    stringValue(entry.asset_specification?.asset?.name)
  );
}

function replacementKitItemId(entry: Record<string, any>) {
  return (
    stringValue(entry.kit_item_id) ??
    stringValue(entry.kit_item?.id) ??
    stringValue(entry.id)
  );
}

function assetSpecificationId(entry: Record<string, any>) {
  return (
    stringValue(entry.asset_spec_id) ??
    stringValue(entry.asset_specification_id) ??
    stringValue(entry.asset_specification?.id) ??
    stringValue(entry.kit_item?.asset_specification_id) ??
    stringValue(entry.kit_item?.asset_specification?.id)
  );
}

function categoryId(entry: Record<string, any>) {
  return (
    stringValue(entry.category?.id) ??
    stringValue(entry.asset?.category?.id) ??
    stringValue(entry.asset_specification?.category?.id) ??
    stringValue(entry.asset_specification?.asset?.category?.id)
  );
}

function categoryName(entry: Record<string, any>) {
  return (
    stringValue(entry.category?.name) ??
    stringValue(entry.category) ??
    stringValue(entry.asset_specification?.category) ??
    stringValue(entry.asset?.category?.name) ??
    stringValue(entry.asset_specification?.asset?.category?.name)
  );
}

function matchesCategory(
  entry: Record<string, any>,
  filters: { categoryId?: string; categoryName?: string },
) {
  const entryCategoryId = categoryId(entry);
  if (filters.categoryId && entryCategoryId)
    return entryCategoryId === filters.categoryId;

  const expectedName = normalizedText(filters.categoryName);
  if (!expectedName) return true;
  return normalizedText(categoryName(entry)) === expectedName;
}

function imageUrl(entry: Record<string, any>) {
  const images =
    entry.images ?? entry.asset?.images ?? entry.asset_specification?.images;
  if (Array.isArray(images)) return stringValue(images[0]);
  return stringValue(entry.image ?? entry.image_url);
}

function leadTimeLabel(entry: Record<string, any>) {
  const days = numberValue(entry.lead_time_days ?? entry.leadTimeDays);
  if (!days) return undefined;
  return `${days} - ${days + 2} Days`;
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object";
}

function numberValue(value: unknown) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizedText(value: unknown) {
  return stringValue(value)?.toLowerCase();
}
