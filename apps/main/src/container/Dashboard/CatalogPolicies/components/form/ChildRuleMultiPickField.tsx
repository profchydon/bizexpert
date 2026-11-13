"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  filterMultiPickOptions,
  normalizeMultiPickOptions,
  removeMultiPickValue,
  type MultiPickOption,
} from "../../utilsMultiPick";

export function MultiPickField({
  label,
  placeholder,
  options,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: MultiPickOption[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = useMemo(
    () => normalizeMultiPickOptions(options),
    [options],
  );
  const labelByValue = Object.fromEntries(
    normalized.map((option) => [option.value, option.label]),
  );
  const filteredOptions = useMemo(() => {
    return filterMultiPickOptions(normalized, query);
  }, [normalized, query]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function toggleValue(option: { value: string; label: string }) {
    const active = values.includes(option.value);
    onChange(
      active
        ? removeMultiPickValue(values, option.value)
        : [...values, option.value],
    );
    setQuery("");
    inputRef.current?.focus();
  }

  function removeValue(value: string) {
    onChange(removeMultiPickValue(values, value));
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-1.5">
      <label className="text-sm font-normal text-gray-700">{label}</label>
      <div
        className={cn(
          "flex min-h-11 w-full items-center gap-3 rounded-lg border bg-white px-3.5 py-1.5 text-sm shadow-sm transition",
          open
            ? "border-primary-600 ring-2 ring-primary-100"
            : "border-gray-300",
        )}
      >
        <Search className="h-5 w-5 shrink-0 text-gray-400" />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {values.map((value) => (
            <SelectedChip
              key={value}
              label={labelByValue[value] ?? value}
              onRemove={() => removeValue(value)}
            />
          ))}
          <input
            ref={inputRef}
            value={query}
            placeholder={values.length ? "" : placeholder}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                setQuery("");
                inputRef.current?.blur();
              }
              if (event.key === "Backspace" && !query && values.length) {
                onChange(values.slice(0, -1));
              }
            }}
            className="h-8 min-w-[120px] flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-[1030] mt-1.5 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const active = values.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => toggleValue(option)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <span className="text-gray-700">{option.label}</span>
                  {active ? (
                    <Check className="h-4 w-4 text-primary-600" />
                  ) : null}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2.5 text-sm text-gray-500">No results.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SelectedChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="flex max-w-[180px] items-center gap-1 rounded-md bg-gray-50 py-1 pl-2 pr-1 text-sm text-gray-700 ring-1 ring-inset ring-gray-200">
      <span className="truncate">{label}</span>
      <button
        type="button"
        aria-label={`Remove ${label}`}
        className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onRemove}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
