"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { SelectionLimit } from "../../types";
import { selectionLimitKey } from "../../selectionLimitAdapters";
import { normalizeBoundedLimitInputValue } from "./selectionLimitInputUtils";

export function SelectionLimitRow({
  limit,
  productCount,
  error,
  onUpdate,
}: {
  limit: SelectionLimit;
  productCount: number;
  error?: string;
  onUpdate: (
    category: string,
    updates: Partial<Pick<SelectionLimit, "min" | "max">>,
  ) => void;
}) {
  const noLimit = limit.max === null;
  const key = selectionLimitKey(limit);

  return (
    <section className="border-b border-gray-200 px-4 py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex w-max items-center whitespace-nowrap rounded-full bg-gray-50 px-2 py-0.5 text-xs font-normal text-gray-700 ring-1 ring-inset ring-gray-200">
          {limit.category}
        </span>
        <span className="text-xs text-gray-500">
          {productCount} product{productCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="flex items-end gap-2">
          <LimitInput
            label="Min"
            value={limit.min}
            maxValue={limit.max === null ? undefined : Math.max(limit.max, 1)}
            disabled={noLimit}
            onChange={(min) => onUpdate(key, { min })}
          />
          <span className="pb-3 text-sm text-gray-400">-</span>
          <LimitInput
            label="Max"
            value={limit.max === null ? "" : Math.max(limit.max, 1)}
            minValue={1}
            disabled={noLimit}
            onChange={(max) => onUpdate(key, { max })}
          />
        </div>

        <button
          type="button"
          className="mb-2 flex items-center gap-2 text-sm text-gray-500"
          onClick={() =>
            onUpdate(key, {
              max: noLimit ? Math.max(limit.min, 1) : null,
            })
          }
        >
          <span
            className={cn(
              "inline-flex h-5 w-9 items-center rounded-full p-0.5 transition",
              noLimit ? "bg-primary-600" : "bg-gray-100",
            )}
          >
            <span
              className={cn(
                "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                noLimit && "translate-x-4",
              )}
            />
          </span>
          No limit
        </button>
      </div>
      {error ? (
        <p className="mt-3 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm font-medium text-error-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}

export function SelectionLimitsDrawerFooter({
  isSaving = false,
  onCancel,
  onSave,
}: {
  isSaving?: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <footer className="flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
      <Button
        type="button"
        variant="outline"
        disabled={isSaving}
        className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-gray-700"
        onClick={onCancel}
        data-testid="selectionlimitsdrawerrows-button"
      >
        Cancel
      </Button>
      <Button
        type="button"
        disabled={isSaving}
        className="h-10 rounded-lg px-4 text-sm font-semibold"
        onClick={onSave}
        data-testid="selectionlimitsdrawerrows-button-2"
      >
        {isSaving ? "Saving..." : "Save changes"}
      </Button>
    </footer>
  );
}

function LimitInput({
  label,
  value,
  minValue = 0,
  maxValue,
  disabled,
  onChange,
}: {
  label: string;
  value: number | "";
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const [displayValue, setDisplayValue] = useState(String(value));

  useEffect(() => {
    setDisplayValue(String(value));
  }, [value]);

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
      {label}
      <input
        type="number"
        min={minValue}
        value={displayValue}
        disabled={disabled}
        onFocus={(event) => {
          if (event.currentTarget.value === "0") event.currentTarget.select();
        }}
        onBlur={() => {
          if (displayValue === "") setDisplayValue(String(value));
        }}
        onWheel={(event) => event.currentTarget.blur()}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            return;
          }
          if (event.currentTarget.value === "0" && /^[1-9]$/.test(event.key)) {
            event.preventDefault();
            const normalized = normalizeBoundedLimitInputValue(
              event.key,
              minValue,
              maxValue,
            );
            setDisplayValue(String(normalized));
            onChange(normalized);
          }
        }}
        onChange={(event) => {
          const nextValue = event.target.value;
          setDisplayValue(nextValue);
          if (nextValue === "") return;

          const normalized = normalizeBoundedLimitInputValue(
            nextValue,
            minValue,
            maxValue,
          );
          setDisplayValue(String(normalized));
          onChange(normalized);
        }}
        className="h-11 w-[70px] rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal text-gray-900 shadow-sm outline-none transition [appearance:textfield] focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </label>
  );
}
