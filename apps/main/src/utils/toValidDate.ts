import { isValid, parseISO } from "date-fns";

export const toValidDate = (
  value: Date | string | number | null | undefined,
): Date | undefined => {
  if (value == null || value === "") return undefined;

  if (value instanceof Date) {
    return isValid(value) ? value : undefined;
  }

  const raw = String(value).trim();
  if (!raw || raw.toLowerCase() === "invalid date") return undefined;

  const isoParsed = parseISO(raw);
  if (isValid(isoParsed)) return isoParsed;

  const fallback = new Date(raw);
  return isValid(fallback) ? fallback : undefined;
};
