"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MarkerPin01 } from "@untitledui/icons";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Input } from "./input";

interface Suggestion {
  place_id: number;
  display_name: string;
}

interface AddressAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  isDisabled?: boolean;
  size?: "sm" | "md";
  hint?: string;
}

export function AddressAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  isInvalid,
  isDisabled,
  size,
  hint,
}: AddressAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isInternalChange = useRef(false);

  useClickOutside({
    ref: wrapperRef,
    isEnabled: open,
    onOutsideClick: () => setOpen(false),
  });

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
    } else {
      setInputValue(value);
    }
  }, [value]);

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`;
        const res = await fetch(url, { headers: { "Accept-Language": "en" } });
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  function handleChange(v: string) {
    isInternalChange.current = true;
    setInputValue(v);
    onChange(""); // Clear parent value to enforce selection
    fetchSuggestions(v);
  }

  function handleSelect(name: string) {
    isInternalChange.current = true;
    setInputValue(name);
    onChange(name);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        icon={MarkerPin01}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        size={size}
        hint={hint}
        data-testid="address-autocomplete-input"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-secondary bg-primary shadow-lg">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-primary hover:bg-primary_hover"
                onClick={() => handleSelect(s.display_name)}
              >
                <MarkerPin01 className="size-4 shrink-0 text-quaternary" />
                {s.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
