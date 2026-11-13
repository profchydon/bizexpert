"use client";

import type { ReactNode } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { WizardRegionFlag } from "./WizardRegionFlag";

export interface WizardAdminOption {
  value: string;
  label: string;
  email?: string;
  country?: string;
  countryCode?: string;
  inviteState?: "pending" | "accepted";
}

interface Props {
  options: WizardAdminOption[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedValues: string[];
  onToggle: (value: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  pendingValue?: string;
  disabled?: boolean;
  /** Replaces "No results found" when there are no options. */
  emptyState?: ReactNode;
}

export function WizardAdminOptionList({
  options,
  search,
  onSearchChange,
  selectedValues,
  onToggle,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  pendingValue,
  disabled = false,
  emptyState,
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
      <ul className="max-h-52 overflow-y-auto py-1">
        {options.map((option) => {
          const selected = selectedValues.includes(option.value);
          const locked = Boolean(option.inviteState);
          const inviteLabel =
            option.inviteState === "pending"
              ? "Pending invitation"
              : option.inviteState === "accepted"
                ? "Already an admin"
                : null;
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  if (locked) return;
                  onToggle(option.value);
                }}
                disabled={disabled || locked}
                aria-disabled={locked || undefined}
                className={cn(
                  "flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm transition",
                  locked ? "cursor-not-allowed" : "hover:bg-gray-50",
                  !locked && selected && "bg-primary-50/50",
                )}
              >
                {option.countryCode && (
                  <span className={cn(locked && "opacity-40")}>
                    <WizardRegionFlag code={option.countryCode} />
                  </span>
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={cn(
                      "truncate",
                      locked ? "text-gray-400" : "text-gray-900",
                    )}
                  >
                    {option.label}
                  </span>
                  {inviteLabel ? (
                    <span className="truncate text-xs text-gray-400">
                      {inviteLabel}
                    </span>
                  ) : (
                    option.country && (
                      <span className="truncate text-xs text-gray-500">
                        {option.country}
                      </span>
                    )
                  )}
                </span>
                {option.value === pendingValue && (
                  <Loader2
                    className="size-4 shrink-0 animate-spin text-primary-600"
                    aria-hidden
                  />
                )}
                {!locked && option.value !== pendingValue && selected && (
                  <Check className="size-4 shrink-0 text-primary-600" />
                )}
              </button>
            </li>
          );
        })}
        {options.length === 0 &&
          !isLoadingMore &&
          (emptyState ?? (
            <li className="px-4 py-3 text-sm text-gray-500">
              No results found
            </li>
          ))}
        {hasMore && onLoadMore && (
          <li className="border-t border-gray-100 p-1">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="w-full rounded-md px-2.5 py-2 text-center text-sm font-semibold text-primary-700 transition hover:bg-gray-50 disabled:text-gray-400"
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </button>
          </li>
        )}
      </ul>
    </>
  );
}
