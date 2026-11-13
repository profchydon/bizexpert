"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectTagOption = string | { value: string; label: string };

export function SelectTags({
  label,
  hint,
  options,
  selected,
  iconUrls,
  onChange,
}: {
  label: string;
  hint: string;
  options: SelectTagOption[];
  selected: string[];
  iconUrls?: Record<string, string>;
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  const labelByValue = Object.fromEntries(
    normalized.map((option) => [option.value, option.label]),
  );
  const available = normalized.filter(
    (option) =>
      !selected.includes(option.value) &&
      option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const allSelected = selected.length >= normalized.length;

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div
          className={cn(
            "relative flex min-h-10 w-full items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300",
            open && "ring-2 ring-primary-600",
          )}
          onMouseDown={() => !allSelected && setOpen(true)}
        >
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {selected.map((value) => (
              <Tag
                key={value}
                value={labelByValue[value] ?? value}
                iconUrl={iconUrls?.[value]}
                onRemove={() =>
                  onChange(selected.filter((item) => item !== value))
                }
              />
            ))}
            <input
              value={query}
              placeholder={`Select ${label.toLowerCase()}`}
              onFocus={() => !allSelected && setOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                if (!allSelected) setOpen(true);
              }}
              className="min-w-[20%] flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
        {open && !allSelected ? (
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {available.length ? (
              available.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange([...selected, option.value]);
                    setQuery("");
                  }}
                >
                  {iconUrls?.[option.value] ? (
                    <Flag url={iconUrls[option.value]} />
                  ) : null}
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No options</div>
            )}
          </div>
        ) : null}
      </div>
      <p className="text-sm text-gray-500">{hint}</p>
    </div>
  );
}

function Tag({
  value,
  iconUrl,
  onRemove,
}: {
  value: string;
  iconUrl?: string;
  onRemove: () => void;
}) {
  return (
    <span className="flex items-center rounded-md bg-white py-0.5 pl-2 pr-1 ring-1 ring-inset ring-gray-300">
      {iconUrl ? <Flag url={iconUrl} className="mr-1.5 h-4 w-4" /> : null}
      <span className="truncate whitespace-nowrap text-sm font-medium text-gray-700">
        {value}
      </span>
      <button
        type="button"
        className="ml-1 rounded p-0.5 text-gray-400 hover:bg-gray-100"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function Flag({ url, className }: { url: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("h-5 w-5 rounded-full bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}
