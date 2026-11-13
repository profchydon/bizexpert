const STORAGE_PREFIX = "catalog-policy-selection-limits-reviewed";
export const REVIEW_SELECTION_LIMITS_PARAM = "reviewSelectionLimits";

export function selectionLimitReviewKey(
  companyId?: string,
  catalogId?: string,
) {
  if (!companyId || !catalogId) return null;
  return `${STORAGE_PREFIX}:${companyId}:${catalogId}`;
}

export function hasReviewedSelectionLimits(
  key: string | null,
  storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage,
) {
  if (!key || !storage) return false;
  return storage.getItem(key) === "1";
}

export function markSelectionLimitsReviewed(
  key: string | null,
  storage: Pick<Storage, "setItem"> | undefined = globalThis.localStorage,
) {
  if (!key || !storage) return;
  storage.setItem(key, "1");
}

export function removeSelectionLimitsReviewParam(
  pathname: string,
  searchParams: string,
) {
  const params = new URLSearchParams(searchParams);
  params.delete(REVIEW_SELECTION_LIMITS_PARAM);

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
