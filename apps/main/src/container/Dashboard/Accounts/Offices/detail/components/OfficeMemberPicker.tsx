"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { officeModalFieldHintClass } from "./officeModalFieldClasses";
import { OfficeMemberOptionList } from "./OfficeMemberOptionList";

export interface PickerOption {
  id: string;
  label: string;
  supportingText?: string;
  initials?: string;
  icon?: ReactNode;
}

interface Props {
  label: string;
  placeholder: string;
  hint?: string;
  options: PickerOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onQueryChange?: (query: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function shouldShowOfficeMemberPickerList(focused: boolean) {
  return focused;
}

export function OfficeMemberPicker({
  label,
  placeholder,
  hint,
  options,
  selectedIds,
  onChange,
  onQueryChange,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seenOptionsRef = useRef(new Map<string, PickerOption>());

  options.forEach((option) => seenOptionsRef.current.set(option.id, option));

  useEffect(() => {
    if (selectedIds.length === 0) setQuery("");
  }, [selectedIds.length]);

  useEffect(() => {
    if (!focused) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && containerRef.current?.contains(target)) return;
      setFocused(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [focused]);

  const selectedOptions = selectedIds
    .map((id) => seenOptionsRef.current.get(id))
    .filter((option): option is PickerOption => Boolean(option));

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalized) ||
        option.supportingText?.toLowerCase().includes(normalized),
    );
  }, [options, query]);

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((entry) => entry !== id)
        : [...selectedIds, id],
    );
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) return;
    setFocused(false);
  }

  const showList = shouldShowOfficeMemberPickerList(focused);

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div ref={containerRef} className="relative" onBlur={handleBlur}>
        <div
          className={cn(
            "flex min-h-10 w-full cursor-text flex-wrap items-center gap-1.5 overflow-hidden rounded-lg border border-input bg-white px-3.5 py-1.5",
            showList &&
              "rounded-b-none border-primary-600 ring-1 ring-primary-600",
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex max-w-full items-center gap-1 rounded-md border border-gray-300 bg-white py-0.5 pl-1.5 pr-1 text-sm text-gray-700"
              data-testid="officememberpicker-tag"
            >
              {option.icon && (
                <span className="shrink-0 text-gray-400">{option.icon}</span>
              )}
              <span className="min-w-0 truncate font-medium">
                {option.label}
              </span>
              <button
                type="button"
                aria-label={`Remove ${option.label}`}
                className="rounded-sm p-0.5 text-gray-400 hover:text-gray-600"
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  toggle(option.id);
                }}
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          <span className="flex min-w-0 flex-[1_1_140px] items-center gap-2">
            <Search className="size-5 shrink-0 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                onQueryChange?.(event.target.value);
              }}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              className="h-7 w-full min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-500"
              data-testid="officememberpicker-input"
            />
          </span>
        </div>
        {showList && (
          <OfficeMemberOptionList
            options={filtered}
            selectedIds={selectedIds}
            onToggle={toggle}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>
      {hint && <p className={officeModalFieldHintClass}>{hint}</p>}
    </div>
  );
}
