"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { filterOptionsByQuery } from "../../utilsFilters";

type FilterOption = { value: string; label: string };

export function FilterMultiSelect({
  label,
  options,
  selected,
  open,
  onOpenChange,
  onClear,
  onToggle,
}: {
  label: string;
  options: FilterOption[];
  selected: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
  onToggle: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);
  const filtered = filterOptionsByQuery(options, query);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOpenChange(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onOpenChange, open]);

  return (
    <div ref={ref} className="relative flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-3 text-left text-sm font-normal text-gray-700 shadow-sm transition hover:bg-gray-50"
        onClick={() => onOpenChange(!open)}
      >
        <span
          className={cn("truncate", selected.length === 0 && "text-gray-400")}
        >
          {selectedLabels.length
            ? selectedLabels.join(", ")
            : `Select ${label.toLowerCase()}`}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-10 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${label.toLowerCase()}`}
                className="h-9 w-full rounded-md border border-gray-200 pl-8 pr-3 text-sm font-normal outline-none focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex max-h-48 flex-col overflow-y-auto py-1">
            {filtered.length ? (
              filtered.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                    onClick={() => onToggle(option.value)}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        checked
                          ? "border-primary-600 bg-primary-600 text-white"
                          : "border-gray-300 bg-white",
                      )}
                    >
                      {checked ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-sm text-gray-500">
                No results found
              </p>
            )}
          </div>
          {selected.length ? (
            <button
              type="button"
              className="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
              onClick={onClear}
            >
              <X className="h-3.5 w-3.5" />
              Clear {label.toLowerCase()}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
