"use client";

import { ChevronDown } from "@untitledui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  specSuggestions,
  specTypeLabel,
} from "./deviceSpecification/specSuggestions";

type Option = {
  label: string;
  value: string;
};

type Props = {
  typeValue: string;
  value: string;
  options: readonly Option[];
  disabledType?: boolean;
  restrictValue?: boolean;
  onTypeChange: (type: string) => void;
  onValueChange: (value: string) => void;
};

const LIST_CLASS =
  "absolute z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-secondary bg-primary py-1 shadow-lg";
const ITEM_CLASS =
  "flex w-full px-3.5 py-2 text-left text-sm text-primary hover:bg-primary_hover";

const EquipmentEditSpecField = ({
  typeValue,
  value,
  options,
  disabledType = false,
  restrictValue = false,
  onTypeChange,
  onValueChange,
}: Props) => {
  const label = specTypeLabel(typeValue);
  const suggestions = specSuggestions(typeValue);
  const [typeOpen, setTypeOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (restrictValue) return suggestions;
    const query = value.trim().toLowerCase();
    if (!query) return suggestions;
    return suggestions.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }, [restrictValue, suggestions, value]);

  useEffect(() => {
    if (!typeOpen && !valueOpen) return;
    const handler = (event: MouseEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) {
        setTypeOpen(false);
        setValueOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [typeOpen, valueOpen]);

  return (
    <div ref={fieldRef} className="relative">
      <div className="flex w-full items-stretch overflow-hidden rounded-lg bg-primary shadow-xs ring-1 ring-inset ring-primary transition focus-within:ring-2 focus-within:ring-brand">
        <button
          type="button"
          disabled={disabledType}
          onClick={() => setTypeOpen((open) => !open)}
          className={cn(
            "flex shrink-0 items-center gap-1 py-2.5 pl-3.5 pr-2.5 text-sm text-secondary outline-none",
            disabledType ? "cursor-not-allowed" : "cursor-pointer",
          )}
          data-testid="equipmenteditspecfield-type"
        >
          {label || "Select"}
          <ChevronDown aria-hidden className="size-4 text-quaternary" />
        </button>

        <div className="w-px shrink-0 self-stretch bg-quaternary" />

        {restrictValue ? (
          <button
            type="button"
            onClick={() =>
              suggestions.length > 0 && setValueOpen((open) => !open)
            }
            aria-label={`${label} value`}
            className="flex w-full min-w-0 flex-1 items-center justify-between gap-1 bg-transparent px-3.5 py-2.5 text-left text-sm outline-none"
            data-testid="equipmenteditspecfield-value"
          >
            <span
              className={cn(
                "truncate",
                value ? "text-primary" : "text-tertiary",
              )}
            >
              {value || "Select value"}
            </span>
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-quaternary"
            />
          </button>
        ) : (
          <input
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value);
              setValueOpen(true);
            }}
            onFocus={() => suggestions.length > 0 && setValueOpen(true)}
            placeholder="Enter value"
            aria-label={`${label} value`}
            className="w-full min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-primary outline-none placeholder:text-tertiary"
            data-testid="multiplespecfieldgenerator-input"
          />
        )}
      </div>

      {typeOpen && !disabledType ? (
        <ul className={cn(LIST_CLASS, "left-0 top-full min-w-44")}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onTypeChange(option.value);
                  setTypeOpen(false);
                }}
                className={ITEM_CLASS}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {valueOpen && filtered.length > 0 ? (
        <ul className={cn(LIST_CLASS, "left-0 top-full w-full")}>
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onValueChange(item.label);
                  setValueOpen(false);
                }}
                className={ITEM_CLASS}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default EquipmentEditSpecField;
