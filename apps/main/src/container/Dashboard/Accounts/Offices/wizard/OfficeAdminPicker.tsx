"use client";

import { Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  WizardAdminOptionList,
  type WizardAdminOption,
} from "../../components/wizard/WizardAdminOptionList";
import { wizardLabelClass } from "../../components/wizard/wizardFieldClasses";
import { OfficeAdminPickerTrigger } from "./OfficeAdminPickerTrigger";

interface Props {
  value: string[];
  onChange: (admins: string[]) => void;
  invalid?: boolean;
  id?: string;
  label?: string;
  options?: WizardAdminOption[];
  onQueryChange?: (query: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  triggerClassName?: string;
  hint?: string;
  isLoading?: boolean;
  pendingValue?: string;
  /** Offered when nobody matches the entity's country, to add someone there. */
  onAddEmployee?: () => void;
  /**
   * Inside a react-aria overlay (e.g. SlideoutMenu) pass `modal={false}` and a
   * container within that overlay: a body-level, modal popover is treated as
   * outside it, so its list cannot scroll or be clicked and outside clicks
   * never reach the overlay.
   */
  modal?: boolean;
  portalContainer?: HTMLElement | null;
}

export function OfficeAdminPicker({
  value,
  onChange,
  invalid,
  id = "wf-admins",
  label = "Entity admins",
  options = [],
  onQueryChange,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  triggerClassName,
  hint,
  isLoading = false,
  pendingValue,
  onAddEmployee,
  modal = true,
  portalContainer,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const seenOptions = useRef(new Map<string, WizardAdminOption>());
  options.forEach((option) => seenOptions.current.set(option.value, option));

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        (option.country ?? "").toLowerCase().includes(term),
    );
  }, [options, search]);

  const selectedOptions = value
    .map((entry) => seenOptions.current.get(entry))
    .filter((option): option is WizardAdminOption => Boolean(option));

  function updateSearch(next: string) {
    setSearch(next);
    onQueryChange?.(next);
  }

  function toggle(admin: string) {
    if (isLoading) return;
    onChange(
      value.includes(admin)
        ? value.filter((entry) => entry !== admin)
        : [...value, admin],
    );
    setOpen(false);
  }

  function removeTag(admin: string, event: React.MouseEvent) {
    event.stopPropagation();
    onChange(value.filter((entry) => entry !== admin));
  }

  // Only when the entity has nobody in its country, not for an empty search.
  const showAddEmployee = Boolean(onAddEmployee) && !search && !hasMore;

  function addEmployee() {
    setOpen(false);
    updateSearch("");
    onAddEmployee?.();
  }

  return (
    <div id={id} className="flex flex-col gap-1.5">
      <Label className={wizardLabelClass}>{label}</Label>
      <Popover
        modal={modal}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) updateSearch("");
        }}
      >
        <OfficeAdminPickerTrigger
          open={open}
          isLoading={isLoading}
          invalid={invalid}
          triggerClassName={triggerClassName}
          selectedOptions={selectedOptions}
          onRemove={removeTag}
        />
        <PopoverContent
          align="start"
          container={portalContainer}
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <WizardAdminOptionList
            options={filtered}
            search={search}
            onSearchChange={updateSearch}
            selectedValues={value}
            onToggle={toggle}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            isLoadingMore={isLoadingMore}
            pendingValue={pendingValue}
            disabled={isLoading}
            emptyState={
              showAddEmployee ? (
                <li className="p-1">
                  <button
                    type="button"
                    onClick={addEmployee}
                    className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition hover:bg-gray-50"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                      <Plus className="size-4" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        Add Employee
                      </span>
                      <span className="text-xs text-gray-500">
                        Add employee to this entity
                      </span>
                    </span>
                  </button>
                </li>
              ) : undefined
            }
          />
        </PopoverContent>
      </Popover>
      {invalid ? (
        <p className="text-sm text-error-600">Assign at least one admin.</p>
      ) : (
        hint && <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}
