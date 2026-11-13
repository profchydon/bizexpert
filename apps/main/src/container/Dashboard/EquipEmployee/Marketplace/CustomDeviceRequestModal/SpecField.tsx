"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { specSuggestions } from "./specSuggestions";
import {
  specTypeLabel,
  specTypeOptions,
  type SpecTypeOption,
} from "./specTypes";

function SpecField({
  type,
  value,
  options = specTypeOptions,
  disabledType = false,
  restrictValue = false,
  onTypeChange,
  onValueChange,
}: Readonly<{
  type: string;
  value: string;
  options?: SpecTypeOption[];
  disabledType?: boolean;
  restrictValue?: boolean;
  onTypeChange: (type: string) => void;
  onValueChange: (value: string) => void;
}>) {
  const label = specTypeLabel(type);
  const suggestions = specSuggestions(type);
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (restrictValue) {
      return suggestions;
    }

    const query = value.trim().toLowerCase();
    if (!query) {
      return suggestions;
    }

    return suggestions.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }, [restrictValue, suggestions, value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (event: MouseEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={fieldRef} className="relative">
      <div className="flex w-full items-stretch overflow-hidden rounded-lg border border-gray-200 bg-white">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabledType}>
            <button
              type="button"
              className={cn(
                "flex shrink-0 items-center gap-1 py-2.5 pl-3.5 pr-2.5 text-sm text-gray-600 outline-none focus:outline-none focus-visible:outline-none",
                disabledType ? "cursor-not-allowed" : "cursor-pointer",
              )}
            >
              {label || "Select"}
              <ChevronDown aria-hidden className="size-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="z-[100000] max-h-60 min-w-44 overflow-y-auto"
          >
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => onTypeChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px shrink-0 self-stretch bg-gray-300" />

        {restrictValue ? (
          <button
            type="button"
            onClick={() =>
              suggestions.length > 0 && setOpen((current) => !current)
            }
            aria-label={`${label} value`}
            className="flex w-full min-w-0 flex-1 items-center justify-between gap-1 bg-transparent px-3.5 py-2.5 text-left text-sm outline-none focus:outline-none focus-visible:outline-none"
          >
            <span
              className={cn(
                "truncate",
                value ? "text-gray-900" : "text-gray-500",
              )}
            >
              {value || "Select value"}
            </span>
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-gray-400"
            />
          </button>
        ) : (
          <input
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Enter value"
            aria-label={`${label} value`}
            className="w-full min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:outline-none focus-visible:outline-none placeholder:text-gray-500"
          />
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute left-0 top-full z-[100000] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onValueChange(item.label);
                  setOpen(false);
                }}
                className="flex w-full flex-col items-start px-3.5 py-2 text-left hover:bg-gray-50"
              >
                <span className="text-sm text-gray-900">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { SpecField };
