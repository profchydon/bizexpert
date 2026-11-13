import { format } from "date-fns";

export const todayIsoDate = (now: Date = new Date()) =>
  format(now, "yyyy-MM-dd");

export const isFuturePurchaseDate = (
  value: string | undefined,
  today: string = todayIsoDate(),
) => {
  const purchaseDate = String(value ?? "").trim();
  if (!purchaseDate) return false;
  return purchaseDate > today;
};
