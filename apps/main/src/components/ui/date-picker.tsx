"use client";
// https://github.com/shadcn-ui/ui/issues/546#issuecomment-1873947429

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { toValidDate } from "@/utils/toValidDate";
import { shouldCloseDatePicker } from "./datePickerSelection";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  className?: React.HTMLProps<HTMLElement>["className"];
  date?: Date | string | null;
  setDate: (date: Date) => void;
  placeHolder?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  disabled?: boolean;
  minDate?: Date;
  popoverModal?: boolean;
  popoverContainer?: HTMLElement | null;
  popoverContentClassName?: string;
}

export const DatePicker: React.FC<Props> = ({
  className,
  date,
  setDate,
  placeHolder = "Choose date",
  disablePastDates = false,
  disableFutureDates = false,
  disabled = false,
  minDate,
  popoverModal = true,
  popoverContainer,
  popoverContentClassName,
}) => {
  const [open, setOpen] = React.useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalizedMinDate = minDate ? new Date(minDate) : undefined;
  normalizedMinDate?.setHours(0, 0, 0, 0);
  const selectedDate = toValidDate(date);
  const isBlocked = (value: Date) => {
    const isPastDateDisabled = disablePastDates && value < today;
    const isFutureDateDisabled = disableFutureDates && value > today;
    const isBeforeMinDate =
      Boolean(normalizedMinDate) && value < (normalizedMinDate as Date);

    return isPastDateDisabled || isFutureDateDisabled || isBeforeMinDate;
  };
  const commitDate = (value: Date | undefined) => {
    const blocked = Boolean(value) && isBlocked(value as Date);
    if (!shouldCloseDatePicker(value, blocked)) {
      return;
    }

    setDate(value as Date);
    setOpen(false);
  };

  return (
    <Popover modal={popoverModal} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal border-gray-200",
            !selectedDate && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
          data-testid="date-picker-button"
        >
          <div className="flex items-center justify-between w-full">
            {selectedDate ? (
              format(selectedDate, "yyyy-MM-dd")
            ) : (
              <span>{placeHolder}</span>
            )}
            <CalendarIcon className="mr-2 h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        container={popoverContainer}
        className={cn("w-auto p-0 z-[9999]", popoverContentClassName)}
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={commitDate}
          initialFocus
          disabled={isBlocked}
        />
        <div className="flex justify-end border-t border-gray-200 px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const floor =
                normalizedMinDate && normalizedMinDate > today
                  ? normalizedMinDate
                  : today;
              if (disableFutureDates && floor > today) {
                return;
              }
              commitDate(floor);
            }}
            data-testid="date-picker-button-2"
          >
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
