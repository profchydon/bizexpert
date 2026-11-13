"use client";

import { useMemo } from "react";
import {
  type DateValue,
  endOfMonth,
  getLocalTimeZone,
  parseDate,
  startOfMonth,
  startOfWeek,
  today,
} from "@internationalized/date";
import { useLocale } from "react-aria-components";
import { HintText } from "@/components/base/input/hint-text";
import { DateRangePicker } from "./date-range-picker";

// Future-oriented pickup/delivery window control (ISO date range, minimum 7 inclusive days).
// Shared by the IT-Admin set-window modal and any other surface that needs the same window rules.
const MIN_WINDOW_DAYS = 7;

function toDateValue(iso?: string): DateValue | null {
  if (!iso) return null;
  try {
    return parseDate(iso.slice(0, 10));
  } catch {
    return null;
  }
}

function inclusiveDays(startIso?: string, endIso?: string): number | null {
  if (!startIso || !endIso) return null;
  const a = Date.parse(startIso.slice(0, 10));
  const b = Date.parse(endIso.slice(0, 10));
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86_400_000) + 1;
}

interface Props {
  startDate?: string;
  endDate?: string;
  onChange: (startIso?: string, endIso?: string) => void;
  ariaLabel?: string;
}

export function PickupWindowPicker({
  startDate,
  endDate,
  onChange,
  ariaLabel = "Pickup window",
}: Props) {
  const { locale } = useLocale();
  const start = toDateValue(startDate);
  const end = toDateValue(endDate);
  const value = start && end ? { start, end } : null;
  const days = inclusiveDays(startDate, endDate);
  const tooShort = days !== null && days < MIN_WINDOW_DAYS;
  const minDate = today(getLocalTimeZone()).add({ days: 1 });

  const presets = useMemo(() => {
    const from = today(getLocalTimeZone()).add({ days: 1 });
    const nextWeekStart = startOfWeek(from, locale).add({ weeks: 1 });
    const nextMonthStart = startOfMonth(from.add({ months: 1 }));
    return {
      sevenDays: {
        label: "Next 7 days",
        value: { start: from, end: from.add({ days: 6 }) },
      },
      twoWeeks: {
        label: "Next 2 weeks",
        value: { start: from, end: from.add({ days: 13 }) },
      },
      thirtyDays: {
        label: "Next 30 days",
        value: { start: from, end: from.add({ days: 29 }) },
      },
      nextWeek: {
        label: "Next week",
        value: { start: nextWeekStart, end: nextWeekStart.add({ days: 6 }) },
      },
      nextMonth: {
        label: "Next month",
        value: { start: nextMonthStart, end: endOfMonth(nextMonthStart) },
      },
    };
  }, [locale]);

  const calendarPresets = useMemo(
    () => ({
      sevenDays: presets.sevenDays,
      twoWeeks: presets.twoWeeks,
      thirtyDays: presets.thirtyDays,
    }),
    [presets],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <DateRangePicker
        aria-label={ariaLabel}
        value={value}
        minValue={minDate}
        isInvalid={tooShort}
        minRangeDays={MIN_WINDOW_DAYS}
        presets={presets}
        calendarPresets={calendarPresets}
        placeholder="Select window"
        onChange={(range) =>
          onChange(range?.start?.toString(), range?.end?.toString())
        }
      />
      <HintText isInvalid={tooShort} className="text-xs">
        {tooShort
          ? `Window must be at least ${MIN_WINDOW_DAYS} days.`
          : `Minimum window is ${MIN_WINDOW_DAYS} days.`}
      </HintText>
    </div>
  );
}
