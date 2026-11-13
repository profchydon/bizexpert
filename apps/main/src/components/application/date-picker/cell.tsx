"use client";

import { useContext } from "react";
import {
  type DateValue,
  getDayOfWeek,
  getLocalTimeZone,
  isToday,
} from "@internationalized/date";
import type { CalendarCellProps as AriaCalendarCellProps } from "react-aria-components";
import {
  CalendarCell as AriaCalendarCell,
  RangeCalendarContext,
  RangeCalendarStateContext,
  useLocale,
  useSlottedContext,
} from "react-aria-components";
import { cx } from "@/utils/cx";

const dayDiff = (a: DateValue, b: DateValue) =>
  Math.round(
    (a.toDate("UTC").getTime() - b.toDate("UTC").getTime()) / 86_400_000,
  );

interface CalendarCellProps extends AriaCalendarCellProps {
  /** Whether the calendar is a range calendar. */
  isRangeCalendar?: boolean;
  /** Whether the cell is highlighted. */
  isHighlighted?: boolean;
  /** Minimum range length in inclusive days — used to explain blocked dates. */
  minRangeDays?: number;
}

export const CalendarCell = ({
  date,
  isHighlighted,
  minRangeDays,
  ...props
}: CalendarCellProps) => {
  const { locale } = useLocale();
  const dayOfWeek = getDayOfWeek(date, locale);
  const rangeCalendarContext = useSlottedContext(RangeCalendarContext);
  const calendarState = useContext(RangeCalendarStateContext);

  const isRangeCalendar = !!rangeCalendarContext;

  // The in-progress anchor (first picked date). Dates too close to it are blocked.
  const anchor = (calendarState?.anchorDate ?? null) as DateValue | null;
  const diffFromAnchor = anchor ? Math.abs(dayDiff(date, anchor)) : null;
  const isMinGap =
    !!minRangeDays &&
    diffFromAnchor !== null &&
    diffFromAnchor > 0 &&
    diffFromAnchor < minRangeDays - 1;

  const start = rangeCalendarContext?.value?.start;
  const end = rangeCalendarContext?.value?.end;

  const isAfterStart = start ? date.compare(start) > 0 : true;
  const isBeforeEnd = end ? date.compare(end) < 0 : true;

  const isAfterOrOnStart = start && date.compare(start) >= 0;
  const isBeforeOrOnEnd = end && date.compare(end) <= 0;
  const isInRange = isAfterOrOnStart && isBeforeOrOnEnd;

  const lastDayOfMonth = new Date(date.year, date.month, 0).getDate();
  const isLastDayOfMonth = date.day === lastDayOfMonth;
  const isFirstDayOfMonth = date.day === 1;

  const isTodayDate = isToday(date, getLocalTimeZone());

  // Weekends are non-interactive only in range calendars (can still be part of range visually)
  const isWeekend = isRangeCalendar && (dayOfWeek === 0 || dayOfWeek === 6);

  return (
    <AriaCalendarCell
      {...props}
      date={date}
      className={({
        isDisabled,
        isUnavailable,
        isFocusVisible,
        isSelectionStart,
        isSelectionEnd,
        isSelected,
        isOutsideMonth,
      }) => {
        const isRoundedLeft = isSelectionStart || dayOfWeek === 0;
        const isRoundedRight = isSelectionEnd || dayOfWeek === 6;
        const isDisabledOrUnavailable = isDisabled || isUnavailable;
        // Weekends are non-interactive (can't be start/end) but can be part of range
        // Outside-month dates are non-interactive — users navigate to the next/prev month to select them
        const isNonInteractive =
          isDisabledOrUnavailable || isWeekend || isOutsideMonth;

        return cx(
          "relative size-10 focus:outline-hidden",
          isRoundedLeft && "rounded-l-full",
          isRoundedRight && "rounded-r-full",
          isInRange && isNonInteractive && "bg-primary_hover",
          isSelected && isRangeCalendar && "bg-primary_hover",
          // Min-gap dates stay hoverable (cursor-not-allowed) so their tooltip can explain the block.
          isMinGap
            ? "pointer-events-auto cursor-not-allowed"
            : isNonInteractive
              ? "pointer-events-none"
              : "cursor-pointer",
          isFocusVisible ? "z-10" : "z-0",
          isOutsideMonth && isRangeCalendar && "hidden",
          !isRangeCalendar && isNonInteractive && "opacity-30",

          // Show gradient on last day of month if it's within the selected range.
          isLastDayOfMonth &&
            isSelected &&
            isBeforeEnd &&
            isRangeCalendar &&
            "after:absolute after:inset-0 after:translate-x-full after:bg-gradient-to-l after:from-transparent after:to-bg-primary_hover in-[[role=gridcell]:last-child]:after:hidden",

          // Show gradient on first day of month if it's within the selected range.
          isFirstDayOfMonth &&
            isSelected &&
            isAfterStart &&
            isRangeCalendar &&
            "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:to-bg-primary_hover in-[[role=gridcell]:first-child]:after:hidden",
        );
      }}
    >
      {({
        isDisabled,
        isUnavailable,
        isFocusVisible,
        isSelectionStart,
        isSelectionEnd,
        isSelected,
        formattedDate,
      }) => {
        const isDisabledOrUnavailable = isDisabled || isUnavailable;
        // Weekends show as disabled visually but can be part of range
        const isVisuallyDisabled = isDisabledOrUnavailable || isWeekend;
        const markedAsSelected =
          isSelectionStart ||
          isSelectionEnd ||
          (isSelected && !isDisabledOrUnavailable && !isRangeCalendar);

        const tooltip = minRangeDays
          ? isMinGap
            ? `Pick a date at least ${minRangeDays} days from your first date.`
            : !anchor && !isVisuallyDisabled
              ? "Select your first date."
              : undefined
          : undefined;

        return (
          <div
            title={tooltip}
            className={cx(
              "relative flex size-full items-center justify-center rounded-full text-sm",
              // Disabled/weekend state - show grayed out text (but today still gets secondary text).
              isVisuallyDisabled && !isTodayDate
                ? ""
                : isVisuallyDisabled && isTodayDate
                  ? "text-tertiary"
                  : "text-secondary hover:text-secondary_hover",
              // Focus ring, visible while the cell has keyboard focus.
              isFocusVisible
                ? "outline-2 outline-offset-2 outline-focus-ring"
                : "",
              // Hover state for cells in the middle of the range.
              isSelected && !isVisuallyDisabled && isRangeCalendar
                ? "font-medium"
                : "",
              markedAsSelected &&
                "bg-brand-solid font-medium text-white hover:bg-brand-solid_hover hover:text-white",
              // Hover state for non-selected cells.
              !isSelected && !isVisuallyDisabled
                ? "hover:bg-primary_hover hover:font-medium!"
                : "",
              !isSelected && isTodayDate ? "bg-primary_hover font-medium" : "",
            )}
          >
            {formattedDate}

            {(isHighlighted || isTodayDate) && (
              <div
                className={cx(
                  "absolute bottom-1 left-1/2 size-1.25 -translate-x-1/2 rounded-full",
                  markedAsSelected
                    ? "bg-fg-white"
                    : isTodayDate
                      ? "bg-fg-brand-primary"
                      : isVisuallyDisabled
                        ? "bg-fg-disabled"
                        : "bg-fg-brand-primary",
                )}
              />
            )}
          </div>
        );
      }}
    </AriaCalendarCell>
  );
};
