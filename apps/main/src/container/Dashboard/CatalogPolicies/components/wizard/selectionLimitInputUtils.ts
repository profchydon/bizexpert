import type { SelectionLimit } from "../../types";

export const normalizeLimitInputValue = (value: string, minValue: number) => {
  const parsed = Number(value || minValue);
  return Math.max(parsed, minValue);
};

export const normalizeBoundedLimitInputValue = (
  value: string,
  minValue: number,
  maxValue?: number,
) => {
  const normalized = normalizeLimitInputValue(value, minValue);
  return typeof maxValue === "number"
    ? Math.min(normalized, maxValue)
    : normalized;
};

export const normalizeSelectionLimitRange = (
  limit: SelectionLimit,
): SelectionLimit =>
  limit.max === null
    ? limit
    : {
        ...limit,
        min: Math.min(limit.min, limit.max),
      };

export const normalizeSelectionLimitMaxValues = (
  limits: SelectionLimit[],
): SelectionLimit[] =>
  limits.map((limit) => {
    const max = limit.max === null ? null : Math.max(limit.max, 1);
    return normalizeSelectionLimitRange({
      ...limit,
      max,
    });
  });
