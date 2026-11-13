import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isBefore,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type { DateWindow } from "@/types/offboard";

export const MIN_WINDOW_DAYS = 7;

export interface WindowPreset {
  label: string;
  range: { from: Date; to: Date };
}

export const minRetrievalDate = (base: Date = new Date()): Date =>
  addDays(startOfDay(base), 1);

export const buildRetrievalPresets = (
  base: Date = new Date(),
): WindowPreset[] => {
  const from = minRetrievalDate(base);
  const nextWeekStart = startOfWeek(addWeeks(startOfDay(base), 1), {
    weekStartsOn: 1,
  });
  const nextMonthStart = startOfMonth(addMonths(startOfDay(base), 1));

  return [
    { label: "Next 7 days", range: { from, to: addDays(from, 6) } },
    { label: "Next 2 weeks", range: { from, to: addDays(from, 13) } },
    { label: "Next 30 days", range: { from, to: addDays(from, 29) } },
    {
      label: "Next week",
      range: { from: nextWeekStart, to: addDays(nextWeekStart, 6) },
    },
    {
      label: "Next month",
      range: { from: nextMonthStart, to: endOfMonth(nextMonthStart) },
    },
  ];
};

export const isWindowInFuture = (
  from?: Date,
  base: Date = new Date(),
): boolean => {
  if (!from) return false;
  return !isBefore(startOfDay(from), minRetrievalDate(base));
};

export const isWindowValid = (
  from?: Date,
  to?: Date,
  base: Date = new Date(),
): boolean => {
  if (!from || !to) return false;
  if (!isWindowInFuture(from, base)) return false;
  return differenceInCalendarDays(to, from) + 1 >= MIN_WINDOW_DAYS;
};

export const isStoredWindowValid = (
  window?: { start: string; end: string },
  base: Date = new Date(),
): boolean => isWindowValid(fromISO(window?.start), fromISO(window?.end), base);

export const formatWindowLabel = (from?: Date, to?: Date): string => {
  if (!from || !to) return "";
  return `${format(from, "d MMM yyyy")} – ${format(to, "d MMM yyyy")}`;
};

export const toISO = (date: Date): string => format(date, "yyyy-MM-dd");

export const fromISO = (iso?: string): Date | undefined =>
  iso ? new Date(`${iso}T00:00:00`) : undefined;
