"use client";

import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { employeeOptionLabel } from "@/utils/employeeOptions";
import type { IEmployees } from "@/types/employees";

export type WizardAdminValueMode = "id" | "name";

interface Props {
  employees: IEmployees[];
  value: string[];
  valueMode: WizardAdminValueMode;
  search: string;
  onSearchChange: (value: string) => void;
  onToggleEmployee: (employee: IEmployees) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  sentinelRef: React.RefObject<HTMLLIElement | null>;
  hasMore: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  requiresCountry?: boolean;
  onListScroll: (event: React.UIEvent<HTMLUListElement>) => void;
}

export function employeeAdminValue(
  employee: IEmployees,
  valueMode: WizardAdminValueMode,
) {
  return valueMode === "id"
    ? String(employee.id)
    : employeeOptionLabel(employee);
}

export function WizardAdminPickerDropdown({
  employees,
  value,
  valueMode,
  search,
  onSearchChange,
  onToggleEmployee,
  listRef,
  sentinelRef,
  hasMore,
  isInitialLoading,
  isLoadingMore,
  isError,
  requiresCountry = false,
  onListScroll,
}: Props) {
  return (
    <>
      <div className="border-b border-gray-200 p-2">
        <div className="flex items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1.5">
          <Search className="size-4 shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>
      <ul
        ref={listRef}
        role="listbox"
        className="max-h-52 touch-pan-y overflow-y-auto overscroll-contain py-1"
        onScroll={onListScroll}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        {employees.map((employee) => {
          const name = employeeOptionLabel(employee);
          const optionValue = employeeAdminValue(employee, valueMode);
          const selected = value.includes(optionValue);
          return (
            <li key={String(employee.id)}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onToggleEmployee(employee)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm transition hover:bg-gray-50",
                  selected && "bg-primary-50/50",
                )}
              >
                <span className="flex-1 text-gray-900">{name}</span>
                {selected && (
                  <Check className="size-4 shrink-0 text-primary-700" />
                )}
              </button>
            </li>
          );
        })}
        {hasMore ? <li ref={sentinelRef} className="h-1" aria-hidden /> : null}
        {isInitialLoading && (
          <li className="px-4 py-3 text-sm text-gray-500">
            Loading employees...
          </li>
        )}
        {isError && (
          <li className="px-4 py-3 text-sm text-error-600">
            Could not load employees.
          </li>
        )}
        {!isInitialLoading && !isError && requiresCountry && (
          <li className="px-4 py-3 text-sm text-gray-500">
            Select a country to see matching admins.
          </li>
        )}
        {!isInitialLoading &&
          !isError &&
          !requiresCountry &&
          employees.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-500">
              No results found
            </li>
          )}
        {isLoadingMore && (
          <li className="px-4 py-2 text-sm text-gray-500">Loading more...</li>
        )}
      </ul>
    </>
  );
}
