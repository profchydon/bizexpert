"use client";

import { useMemo, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  today,
} from "@internationalized/date";
import { Calendar as CalendarIcon } from "@untitledui/icons";
import { useDateFormatter } from "react-aria";
import type {
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
} from "react-aria-components";
import {
  DateRangePicker as AriaDateRangePicker,
  Dialog as AriaDialog,
  Group as AriaGroup,
  Popover as AriaPopover,
  useLocale,
} from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { DateInput } from "./date-input";
import { RangeCalendar } from "./range-calendar";
import { RangePresetButton } from "./range-preset";

const now = today(getLocalTimeZone());

const highlightedDates = [today(getLocalTimeZone())];

type RangePresetMap = Record<
  string,
  { label: string; value: { start: DateValue; end: DateValue } }
>;

interface DateRangePickerProps extends AriaDateRangePickerProps<DateValue> {
  /** The function to call when the apply button is clicked. */
  onApply?: () => void;
  /** The function to call when the cancel button is clicked. */
  onCancel?: () => void;
  /** Whether to show the preset date range options. Defaults to true. */
  showPresets?: boolean;
  /** Override the sidebar presets. Falls back to the built-in relative presets. */
  presets?: RangePresetMap;
  /** Override the in-calendar (mobile) quick presets. */
  calendarPresets?: RangePresetMap;
  /** Trigger label shown when no range is selected. Defaults to "Select dates". */
  placeholder?: string;
  /** Minimum range length, in inclusive days. Dates closer than this to the
   * in-progress anchor are blocked in the calendar. */
  minRangeDays?: number;
}

export const DateRangePicker = ({
  value: valueProp,
  defaultValue,
  onChange,
  onApply,
  onCancel,
  showPresets = true,
  presets: presetsProp,
  calendarPresets,
  placeholder = "Select dates",
  minRangeDays,
  minValue,
  maxValue,
  isDateUnavailable,
  ...props
}: DateRangePickerProps) => {
  const { locale } = useLocale();
  const formatter = useDateFormatter({
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  // Use internal state and sync with external value for proper controlled behavior
  const [internalValue, setInternalValue] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(valueProp ?? defaultValue ?? null);
  const [focusedValue, setFocusedValue] = useState<DateValue | null>(null);

  // Sync internal value with external prop changes
  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = (newValue: { start: DateValue; end: DateValue } | null) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const formattedStartDate = value?.start
    ? formatter.format(value.start.toDate(getLocalTimeZone()))
    : "Select date";
  const formattedEndDate = value?.end
    ? formatter.format(value.end.toDate(getLocalTimeZone()))
    : "Select date";

  const defaultPresets = useMemo(
    () => ({
      today: { label: "Today", value: { start: now, end: now } },
      yesterday: {
        label: "Yesterday",
        value: {
          start: now.subtract({ days: 1 }),
          end: now.subtract({ days: 1 }),
        },
      },
      thisWeek: {
        label: "This week",
        value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) },
      },
      lastWeek: {
        label: "Last week",
        value: {
          start: startOfWeek(now, locale).subtract({ weeks: 1 }),
          end: endOfWeek(now, locale).subtract({ weeks: 1 }),
        },
      },
      thisMonth: {
        label: "This month",
        value: { start: startOfMonth(now), end: endOfMonth(now) },
      },
      lastMonth: {
        label: "Last month",
        value: {
          start: startOfMonth(now).subtract({ months: 1 }),
          end: endOfMonth(now).subtract({ months: 1 }),
        },
      },
      thisYear: {
        label: "This year",
        value: {
          start: startOfMonth(now.set({ month: 1 })),
          end: endOfMonth(now.set({ month: 12 })),
        },
      },
      lastYear: {
        label: "Last year",
        value: {
          start: startOfMonth(now.set({ month: 1 }).subtract({ years: 1 })),
          end: endOfMonth(now.set({ month: 12 }).subtract({ years: 1 })),
        },
      },
      allTime: {
        label: "All time",
        value: {
          start: now.set({ year: 2000, month: 1, day: 1 }),
          end: now,
        },
      },
    }),
    [locale],
  );

  const presets = presetsProp ?? defaultPresets;
  const inCalendarPresets =
    calendarPresets ??
    (presetsProp
      ? presetsProp
      : {
          lastWeek: defaultPresets.lastWeek,
          lastMonth: defaultPresets.lastMonth,
          lastYear: defaultPresets.lastYear,
        });

  return (
    <AriaDateRangePicker
      aria-label="Date range picker"
      shouldCloseOnSelect={false}
      {...props}
      minValue={minValue}
      maxValue={maxValue}
      isDateUnavailable={isDateUnavailable}
      value={value}
      onChange={setValue}
    >
      <AriaGroup>
        <Button
          size="md"
          color="secondary"
          iconLeading={CalendarIcon}
          data-testid="date-range-picker-button"
        >
          {!value ? (
            <span className="text-placeholder">{placeholder}</span>
          ) : (
            `${formattedStartDate} – ${formattedEndDate}`
          )}
        </Button>
      </AriaGroup>
      <AriaPopover
        placement="top left"
        offset={8}
        className={({ isEntering, isExiting }) =>
          cx(
            "origin-(--trigger-anchor-point) will-change-transform",
            isEntering &&
              "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
            isExiting &&
              "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
          )
        }
      >
        <AriaDialog className="flex rounded-2xl bg-primary shadow-xl ring ring-secondary_alt focus:outline-hidden">
          {({ close }) => (
            <>
              {showPresets && (
                <div className="hidden w-38 flex-col gap-0.5 border-r border-solid border-secondary p-3 lg:flex">
                  {Object.values(presets).map((preset) => (
                    <RangePresetButton
                      key={preset.label}
                      value={preset.value}
                      onClick={() => {
                        setValue(preset.value);
                        setFocusedValue(preset.value.start);
                      }}
                    >
                      {preset.label}
                    </RangePresetButton>
                  ))}
                </div>
              )}
              <div className="flex flex-col">
                <RangeCalendar
                  focusedValue={focusedValue}
                  onFocusChange={setFocusedValue}
                  highlightedDates={highlightedDates}
                  minValue={minValue}
                  maxValue={maxValue}
                  minRangeDays={minRangeDays}
                  isDateUnavailable={isDateUnavailable}
                  presets={showPresets ? inCalendarPresets : undefined}
                />
                <div className="flex justify-between gap-3 border-t border-secondary p-4">
                  <div className="hidden items-center gap-3 md:flex">
                    <DateInput slot="start" className="w-36" />
                    <div className="text-md text-quaternary">–</div>
                    <DateInput slot="end" className="w-36" />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-3 md:flex md:w-auto">
                    <Button
                      size="md"
                      color="secondary"
                      onClick={() => {
                        onCancel?.();
                        close();
                      }}
                      data-testid="date-range-picker-button-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="md"
                      color="primary"
                      onClick={() => {
                        onApply?.();
                        close();
                      }}
                      data-testid="date-range-picker-button-3"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </AriaDialog>
      </AriaPopover>
    </AriaDateRangePicker>
  );
};
