"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  buildRetrievalPresets,
  formatWindowLabel,
  fromISO,
  isStoredWindowValid,
  isWindowValid,
  minRetrievalDate,
  toISO,
  type DateWindow,
} from "./retrievalWindow";

interface Props {
  value?: DateWindow;
  onApply: (window: DateWindow) => void;
}

interface DraftRange {
  from: Date | undefined;
  to: Date | undefined;
}

const formatField = (date?: Date): string =>
  date ? format(date, "dd / MM / yyyy") : "DD / MM / YYYY";

const RetrievalWindowPicker: React.FC<Props> = ({ value, onApply }) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DraftRange>({
    from: undefined,
    to: undefined,
  });

  const storedValid = isStoredWindowValid(value);

  useEffect(() => {
    if (!open) return;
    if (isStoredWindowValid(value)) {
      setRange({ from: fromISO(value?.start), to: fromISO(value?.end) });
      return;
    }
    setRange({ from: undefined, to: undefined });
  }, [open, value]);

  const presets = buildRetrievalPresets();
  const minDate = minRetrievalDate();
  const valid = isWindowValid(range.from, range.to);
  const selectedLabel = storedValid
    ? formatWindowLabel(fromISO(value?.start), fromISO(value?.end))
    : "";

  const handleApply = () => {
    if (!valid || !range.from || !range.to) return;
    onApply({ start: toISO(range.from), end: toISO(range.to) });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-fit gap-2 px-4 text-sm font-semibold text-gray-700"
          data-testid="retrievalwindowpicker-button"
        >
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          {selectedLabel || "Select retrieval window"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex">
          <div className="flex w-40 flex-col gap-1 border-r border-gray-100 p-3">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setRange(preset.range)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={range.from ?? new Date()}
            selected={range}
            onSelect={(selected) =>
              setRange({ from: selected?.from, to: selected?.to })
            }
            disabled={{ before: minDate }}
            classNames={{
              day_selected:
                "bg-primary-600 text-white hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white",
              day_range_middle:
                "aria-selected:bg-primary-50 aria-selected:text-primary-700",
              day_today: "font-semibold text-primary-700",
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600">
              {formatField(range.from)}
            </div>
            <span className="text-gray-400">–</span>
            <div className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600">
              {formatField(range.to)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4 text-sm font-semibold text-gray-700"
              onClick={() => setOpen(false)}
              data-testid="retrievalwindowpicker-button-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="h-10 px-4 text-sm font-semibold"
              disabled={!valid}
              onClick={handleApply}
              data-testid="retrievalwindowpicker-button-3"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RetrievalWindowPicker;
