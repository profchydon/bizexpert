"use client";

import type { HTMLAttributes, PropsWithChildren } from "react";
import { Fragment, useContext, useEffect, useState } from "react";
import type { CalendarDate } from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { useDateFormatter } from "react-aria";
import type {
  RangeCalendarProps as AriaRangeCalendarProps,
  DateValue,
} from "react-aria-components";
import {
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarContext,
  RangeCalendarStateContext,
  useSlottedContext,
} from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { CalendarCell } from "./cell";
import { DateInput } from "./date-input";

export const RangeCalendarContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [value, onChange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(null);
  const [focusedValue, onFocusChange] = useState<DateValue | undefined>();

  return (
    <RangeCalendarContext.Provider
      value={{ value, onChange, focusedValue, onFocusChange }}
    >
      {children}
    </RangeCalendarContext.Provider>
  );
};

const RangeCalendarTitle = ({ part }: { part: "start" | "end" }) => {
  const context = useContext(RangeCalendarStateContext);

  if (!context) {
    throw new Error(
      "<RangeCalendarTitle /> must be used within a <RangeCalendar /> component.",
    );
  }

  const formatter = useDateFormatter({
    month: "long",
    year: "numeric",
    calendar: context.visibleRange.start.calendar.identifier,
    timeZone: context.timeZone,
  });

  return part === "start"
    ? formatter.format(context.visibleRange.start.toDate(context.timeZone))
    : formatter.format(context.visibleRange.end.toDate(context.timeZone));
};

const dayDiff = (a: DateValue, b: DateValue) =>
  Math.round(
    (a.toDate("UTC").getTime() - b.toDate("UTC").getTime()) / 86_400_000,
  );

// Bridges the in-progress anchor (first clicked date) out of the calendar state
// so the parent can forbid dates that would make the range shorter than the minimum.
const AnchorWatcher = ({
  onAnchor,
}: {
  onAnchor: (date: DateValue | null) => void;
}) => {
  const state = useContext(RangeCalendarStateContext);
  const anchor = (state?.anchorDate ?? null) as DateValue | null;
  const key = anchor ? anchor.toString() : null;
  useEffect(() => {
    onAnchor(anchor);
    // Only re-run when the anchor date itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
};

const MobilePresetButton = ({
  value,
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  value: { start: DateValue; end: DateValue };
}) => {
  const context = useContext(RangeCalendarStateContext);

  return (
    <Button
      {...props}
      slot={null}
      size="sm"
      color="link-color"
      onClick={() => {
        context?.setValue(value);
        context?.setFocusedDate(value.start as CalendarDate);
      }}
      data-testid="range-calendar-button"
    >
      {children}
    </Button>
  );
};

interface RangeCalendarProps extends AriaRangeCalendarProps<DateValue> {
  /** The dates to highlight. */
  highlightedDates?: DateValue[];
  /** The date presets to display. */
  presets?: Record<
    string,
    { label: string; value: { start: DateValue; end: DateValue } }
  >;
  /** Minimum range length, in inclusive days. Blocks dates within this span of the anchor. */
  minRangeDays?: number;
}

export const RangeCalendar = ({
  presets,
  minRangeDays,
  isDateUnavailable: isDateUnavailableProp,
  ...props
}: RangeCalendarProps) => {
  const isDesktop = useBreakpoint("md");
  const context = useSlottedContext(RangeCalendarContext);

  const ContextWrapper = context ? Fragment : RangeCalendarContextProvider;

  // While a range is being picked, forbid dates closer than the minimum to the anchor.
  const [anchorDate, setAnchorDate] = useState<DateValue | null>(null);
  const isDateUnavailable =
    minRangeDays && anchorDate
      ? (date: DateValue) => {
          if (isDateUnavailableProp?.(date, anchorDate as CalendarDate))
            return true;
          const diff = Math.abs(dayDiff(date, anchorDate));
          return diff > 0 && diff < minRangeDays - 1;
        }
      : isDateUnavailableProp;

  return (
    <ContextWrapper>
      <AriaRangeCalendar
        className="flex items-start"
        visibleDuration={{
          months: isDesktop ? 2 : 1,
        }}
        isDateUnavailable={isDateUnavailable}
        allowsNonContiguousRanges={minRangeDays ? true : undefined}
        {...props}
      >
        {minRangeDays ? <AnchorWatcher onAnchor={setAnchorDate} /> : null}
        <div className="flex flex-col gap-3 px-6 py-5">
          <header className="relative flex items-center justify-between md:justify-start">
            <Button
              slot="previous"
              iconLeading={ChevronLeft}
              size="sm"
              color="tertiary"
              className="size-8"
              data-testid="range-calendar-button-2"
            />

            <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-fg-secondary">
              <RangeCalendarTitle part="start" />
            </h2>

            <Button
              slot="next"
              iconLeading={ChevronRight}
              size="sm"
              color="tertiary"
              className="size-8 md:hidden"
              data-testid="range-calendar-button-3"
            />
          </header>

          {!isDesktop && (
            <div className="flex items-center gap-2 md:hidden">
              <DateInput slot="start" className="flex-1" />
              <div className="text-md text-quaternary">–</div>
              <DateInput slot="end" className="flex-1" />
            </div>
          )}

          {!isDesktop && presets && (
            <div className="mt-1 flex justify-between gap-3 px-2 md:hidden">
              {Object.values(presets).map((preset) => (
                <MobilePresetButton key={preset.label} value={preset.value}>
                  {preset.label}
                </MobilePresetButton>
              ))}
            </div>
          )}

          <AriaCalendarGrid weekdayStyle="short" className="w-max">
            <AriaCalendarGridHeader>
              {(day) => (
                <AriaCalendarHeaderCell className="border-b-4 border-transparent p-0">
                  <div className="flex size-10 items-center justify-center text-sm font-medium text-secondary">
                    {day.slice(0, 2)}
                  </div>
                </AriaCalendarHeaderCell>
              )}
            </AriaCalendarGridHeader>
            <AriaCalendarGridBody className="[&_td]:p-0 [&_tr]:border-b-4 [&_tr]:border-transparent [&_tr:last-of-type]:border-none">
              {(date) => (
                <CalendarCell date={date} minRangeDays={minRangeDays} />
              )}
            </AriaCalendarGridBody>
          </AriaCalendarGrid>
        </div>

        {isDesktop && (
          <div className="flex flex-col gap-3 border-l border-secondary px-6 py-5">
            <header className="relative flex items-center justify-end">
              <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-fg-secondary">
                <RangeCalendarTitle part="end" />
              </h2>

              <Button
                slot="next"
                iconLeading={ChevronRight}
                size="sm"
                color="tertiary"
                className="size-8"
                data-testid="range-calendar-button-4"
              />
            </header>

            <AriaCalendarGrid
              weekdayStyle="short"
              offset={{ months: 1 }}
              className="w-max"
            >
              <AriaCalendarGridHeader>
                {(day) => (
                  <AriaCalendarHeaderCell className="border-b-4 border-transparent p-0">
                    <div className="flex size-10 items-center justify-center text-sm font-medium text-secondary">
                      {day.slice(0, 2)}
                    </div>
                  </AriaCalendarHeaderCell>
                )}
              </AriaCalendarGridHeader>
              <AriaCalendarGridBody className="[&_td]:p-0 [&_tr]:border-b-4 [&_tr]:border-transparent [&_tr:last-of-type]:border-none">
                {(date) => (
                  <CalendarCell date={date} minRangeDays={minRangeDays} />
                )}
              </AriaCalendarGridBody>
            </AriaCalendarGrid>
          </div>
        )}
      </AriaRangeCalendar>
    </ContextWrapper>
  );
};
