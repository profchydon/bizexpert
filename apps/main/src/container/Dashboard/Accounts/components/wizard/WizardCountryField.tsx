"use client";

import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { mapCountriesToWizardOptions } from "../../utils/mapCountriesToWizardOptions";
import {
  wizardFieldTriggerClass,
  wizardLabelClass,
} from "./wizardFieldClasses";
import { WizardRegionFlag } from "./WizardRegionFlag";

interface Props {
  id?: string;
  value: string | null;
  onValueChange: (value: string) => void;
  invalid?: boolean;
  errorMessage?: string;
}

export function WizardCountryField({
  id,
  value,
  onValueChange,
  invalid,
  errorMessage,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, isError } = useGetCountriesQuery();

  const options = useMemo(
    () => mapCountriesToWizardOptions(data?.data?.data),
    [data],
  );
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [options, query],
  );

  function openField() {
    if (isLoading || isError) return;
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectCountry(country: string) {
    onValueChange(country);
    setOpen(false);
  }

  return (
    <div id={id} className="flex flex-col gap-1.5">
      <Label className={wizardLabelClass}>Country</Label>
      <div ref={rootRef} className="relative">
        <div
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            wizardFieldTriggerClass,
            "relative cursor-text gap-2 pr-10",
            open && "border-primary-600 ring-2 ring-primary-600/20",
            invalid && !open && "border-error-500",
            (isLoading || isError) && "cursor-not-allowed opacity-60",
          )}
          aria-disabled={isLoading || isError}
          onMouseDown={(event) => {
            if (open || isLoading || isError) return;
            event.preventDefault();
            openField();
          }}
        >
          {selected && !open && (
            <WizardRegionFlag
              code={selected.code}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            />
          )}
          <input
            ref={inputRef}
            value={open ? query : (selected?.label ?? "")}
            readOnly={!open || isLoading}
            disabled={isLoading || isError}
            placeholder={
              isLoading
                ? "Loading countries..."
                : isError
                  ? "Unable to load countries"
                  : "Select country of registration"
            }
            onChange={(event) => setQuery(event.target.value)}
            className={cn(
              "w-full bg-transparent text-sm outline-none placeholder:text-gray-500",
              selected && !open ? "pl-7 text-gray-900" : "text-gray-900",
            )}
          />
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
        {open && (
          <ul
            role="listbox"
            className="absolute left-0 top-[calc(100%+4px)] z-[100010] max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            {filtered.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCountry(option.value)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-gray-900 hover:bg-gray-50",
                    value === option.value && "bg-gray-50",
                  )}
                >
                  <WizardRegionFlag code={option.code} />
                  {option.label}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">
                No results found
              </li>
            )}
          </ul>
        )}
      </div>
      {isError && (
        <p className="text-sm text-error-600">
          Countries could not be loaded. Try again later.
        </p>
      )}
      {invalid && errorMessage && (
        <p className="text-sm text-error-600">{errorMessage}</p>
      )}
    </div>
  );
}
