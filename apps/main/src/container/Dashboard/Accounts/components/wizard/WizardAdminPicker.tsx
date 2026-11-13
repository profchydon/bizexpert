"use client";

import { ChevronDown, X } from "lucide-react";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { employeeOptionLabel } from "@/utils/employeeOptions";
import type { IEmployees } from "@/types/employees";
import { usePaginatedEmployees } from "../../hooks/usePaginatedEmployees";
import { useWizardAdminPickerDismiss } from "../../hooks/useWizardAdminPickerDismiss";
import { useWizardAdminPickerScroll } from "../../hooks/useWizardAdminPickerScroll";
import {
  employeeAdminValue,
  WizardAdminPickerDropdown,
  type WizardAdminValueMode,
} from "./WizardAdminPickerDropdown";
import {
  wizardFieldTriggerClass,
  wizardLabelClass,
} from "./wizardFieldClasses";

interface Props {
  value: string[];
  onChange: (admins: string[]) => void;
  selectedLabels?: Record<string, string>;
  onSelectedLabelsChange?: (labels: Record<string, string>) => void;
  invalid?: boolean;
  id?: string;
  label?: string;
  triggerClassName?: string;
  valueMode?: WizardAdminValueMode;
  country?: string | null;
  filterByCountry?: boolean;
}

export function WizardAdminPicker({
  value,
  onChange,
  selectedLabels = {},
  onSelectedLabelsChange,
  invalid,
  id = "wf-admins",
  label = "Entity admins",
  triggerClassName,
  valueMode = "name",
  country = null,
  filterByCountry = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const employeeQuery = usePaginatedEmployees(search, open, {
    country,
    filterByCountry,
  });
  const countryBlocked = employeeQuery.requiresCountry;

  useWizardAdminPickerDismiss(
    open,
    rootRef,
    () => setOpen(false),
    () => setSearch(""),
  );

  useWizardAdminPickerScroll({
    open,
    hasMore: employeeQuery.hasMore,
    isInitialLoading: employeeQuery.isInitialLoading,
    isLoadingMore: employeeQuery.isLoadingMore,
    loadMore: employeeQuery.loadMore,
    listRef,
    sentinelRef,
    itemCount: employeeQuery.employees.length,
  });

  function handleListScroll(event: React.UIEvent<HTMLUListElement>) {
    event.stopPropagation();
    const target = event.currentTarget;
    const nearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 48;
    if (nearBottom) {
      employeeQuery.loadMore();
    }
  }

  function toggleEmployee(employee: IEmployees) {
    const key = employeeAdminValue(employee, valueMode);
    if (value.includes(key)) {
      onChange(value.filter((entry) => entry !== key));
      if (valueMode === "id") {
        const nextLabels = { ...selectedLabels };
        delete nextLabels[key];
        onSelectedLabelsChange?.(nextLabels);
      }
      return;
    }

    onChange([...value, key]);
    if (valueMode === "id") {
      onSelectedLabelsChange?.({
        ...selectedLabels,
        [key]: employeeOptionLabel(employee),
      });
    }
  }

  function removeTag(key: string, event: React.MouseEvent) {
    event.stopPropagation();
    onChange(value.filter((entry) => entry !== key));
    if (valueMode === "id") {
      const nextLabels = { ...selectedLabels };
      delete nextLabels[key];
      onSelectedLabelsChange?.(nextLabels);
    }
  }

  function displayLabel(key: string) {
    if (valueMode === "name") return key;
    return selectedLabels[key] ?? key;
  }

  const hasSelection = value.length > 0;

  return (
    <div id={id} className="flex flex-col gap-1.5">
      <Label className={wizardLabelClass}>{label}</Label>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          onMouseDown={(event) => {
            event.preventDefault();
            if (countryBlocked) return;
            setOpen((current) => !current);
          }}
          className={cn(
            wizardFieldTriggerClass,
            triggerClassName,
            "w-full justify-between gap-2 text-left",
            hasSelection
              ? "min-h-[44px] h-auto flex-wrap py-2"
              : "text-gray-500",
            open && "border-primary-600 ring-2 ring-primary-600/20",
            invalid && !open && "border-error-500",
            countryBlocked && "cursor-not-allowed opacity-60",
          )}
          aria-disabled={countryBlocked}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {hasSelection ? (
              value.map((entry) => (
                <span
                  key={entry}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                >
                  {displayLabel(entry)}
                  <button
                    type="button"
                    onClick={(event) => removeTag(entry, event)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Remove ${displayLabel(entry)}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))
            ) : (
              <span>
                {countryBlocked ? "Select a country first" : "Assign admins"}
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        {open && (
          <div className="absolute left-0 top-[calc(100%+4px)] z-[100010] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <WizardAdminPickerDropdown
              employees={employeeQuery.employees}
              value={value}
              valueMode={valueMode}
              search={search}
              onSearchChange={setSearch}
              onToggleEmployee={toggleEmployee}
              listRef={listRef}
              sentinelRef={sentinelRef}
              hasMore={employeeQuery.hasMore}
              isInitialLoading={employeeQuery.isInitialLoading}
              isLoadingMore={employeeQuery.isLoadingMore}
              isError={employeeQuery.isError}
              requiresCountry={countryBlocked}
              onListScroll={handleListScroll}
            />
          </div>
        )}
      </div>
      {invalid && (
        <p className="text-sm text-error-600">Assign at least one admin.</p>
      )}
    </div>
  );
}
