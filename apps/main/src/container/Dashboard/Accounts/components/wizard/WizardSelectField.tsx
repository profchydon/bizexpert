"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  wizardFieldTriggerClass,
  wizardLabelClass,
} from "./wizardFieldClasses";

export interface WizardSelectOption {
  value: string;
  label: string;
  supportingText?: string;
  currentLabel?: string;
}

interface Props {
  id?: string;
  label: string;
  placeholder: string;
  value: string | null;
  onValueChange: (value: string) => void;
  options: WizardSelectOption[];
  invalid?: boolean;
  errorMessage?: string;
  hint?: string;
  disabled?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function WizardSelectField({
  id,
  label,
  placeholder,
  value,
  onValueChange,
  options,
  invalid,
  errorMessage,
  hint,
  disabled = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  emptyMessage = "No results found",
}: Props) {
  return (
    <div id={id} className="flex flex-col gap-1.5">
      <Label className={wizardLabelClass}>{label}</Label>
      <SelectPrimitive.Root
        value={value ?? undefined}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          className={cn(
            wizardFieldTriggerClass,
            "justify-between text-gray-900 data-[placeholder]:text-gray-500",
            "data-[state=open]:border-primary-600 data-[state=open]:ring-1 data-[state=open]:ring-inset data-[state=open]:ring-primary-600",
            invalid && "border-error-500",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="size-5 shrink-0 text-gray-400" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "z-[100010] flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg",
              "max-h-[min(20rem,var(--radix-select-content-available-height))]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
            )}
          >
            {onSearchChange && (
              <div
                className="shrink-0 border-b border-gray-100 p-1.5"
                onPointerDown={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <div className="flex items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1.5 focus-within:border-primary-600">
                  <Search className="size-4 shrink-0 text-gray-400" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}
            <SelectPrimitive.Viewport className="min-h-0 min-w-[var(--radix-select-trigger-width)] flex-1 overflow-y-auto overscroll-contain p-1.5">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex w-full cursor-pointer select-none items-center gap-2 rounded-md p-2.5 text-base outline-none",
                    "data-[highlighted]:bg-gray-50 data-[state=checked]:bg-gray-50",
                  )}
                >
                  <span className="flex w-full min-w-0 flex-1 items-center gap-x-2 overflow-hidden">
                    <SelectPrimitive.ItemText>
                      <span className="truncate font-medium text-gray-900">
                        {option.label}
                      </span>
                    </SelectPrimitive.ItemText>
                    {option.currentLabel && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                        <Check className="size-3.5 shrink-0" />
                        {option.currentLabel}
                      </span>
                    )}
                    {option.supportingText && (
                      <span className="shrink-0 whitespace-nowrap text-gray-500">
                        {option.supportingText}
                      </span>
                    )}
                  </span>
                  <SelectPrimitive.ItemIndicator className="ml-auto">
                    <Check className="size-5 shrink-0 text-primary-600" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
              {options.length === 0 && (
                <p className="px-2.5 py-3 text-sm text-gray-500">
                  {emptyMessage}
                </p>
              )}
              {hasMore && onLoadMore && (
                <div
                  className="border-t border-gray-100 p-1"
                  onPointerDown={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                    className="w-full rounded-md px-2.5 py-2 text-center text-sm font-semibold text-primary-700 transition hover:bg-gray-50 disabled:text-gray-400"
                  >
                    {isLoadingMore ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {invalid && errorMessage ? (
        <p className="text-sm text-error-600">{errorMessage}</p>
      ) : (
        hint && <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}
