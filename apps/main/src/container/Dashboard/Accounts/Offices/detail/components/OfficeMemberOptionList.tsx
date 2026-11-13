"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { deviceIconChipClass, deviceIconGlyphClass } from "./deviceIconClasses";
import { OfficeEmployeeAvatar } from "./OfficeEmployeeAvatar";
import type { PickerOption } from "./OfficeMemberPicker";

interface Props {
  options: PickerOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function OfficeMemberOptionList({
  options,
  selectedIds,
  onToggle,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: Props) {
  return (
    <div className="absolute inset-x-0 top-full z-20 max-h-56 overflow-y-auto rounded-b-lg border border-t-0 border-primary-600 bg-white shadow-lg">
      {options.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          No matches found.
        </p>
      ) : (
        options.map((option) => {
          const checked = selectedIds.includes(option.id);
          const leading = option.initials ? (
            <OfficeEmployeeAvatar initials={option.initials} />
          ) : option.icon ? (
            <span
              className={cn(
                deviceIconChipClass,
                deviceIconGlyphClass,
                "size-8",
              )}
            >
              {option.icon}
            </span>
          ) : null;

          return (
            <button
              key={option.id}
              type="button"
              className={cn(
                "flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50",
                checked && "bg-primary-50",
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onToggle(option.id)}
            >
              {leading ?? (
                <Checkbox
                  checked={checked}
                  aria-hidden
                  tabIndex={-1}
                  data-testid="officememberoptionlist-checkbox"
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-900">
                  {option.label}
                </span>
                {option.supportingText && (
                  <span className="block text-xs text-gray-500">
                    {option.supportingText}
                  </span>
                )}
              </span>
              {leading && (
                <Checkbox
                  checked={checked}
                  aria-hidden
                  tabIndex={-1}
                  className="mt-1"
                  data-testid="officememberoptionlist-checkbox-2"
                />
              )}
            </button>
          );
        })
      )}
      {hasMore && onLoadMore && (
        <button
          type="button"
          disabled={isLoadingMore}
          className="w-full border-t border-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-primary-700 hover:bg-gray-50 disabled:text-gray-400"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onLoadMore}
          data-testid="officememberpicker-load-more"
        >
          {isLoadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
