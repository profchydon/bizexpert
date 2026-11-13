"use client";

import React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import CustomTooltip from "@/components/CustomTooltip";

interface Option<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface Props<T extends string> {
  label: string;
  value?: T;
  options: Option<T>[];
  disabled?: boolean;
  onSelect: (value: T) => void;
  testId?: string;
}

const BulkActionMenu = <T extends string>({
  label,
  value,
  options,
  disabled = false,
  onSelect,
  testId,
}: Props<T>) => {
  const current = options.find((option) => option.value === value);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-white px-3 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          data-testid={testId}
        >
          <span className="truncate">{current?.label ?? `${label}`}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px]">
          {options.map((option) => {
            const item = (
              <DropdownMenuItem
                key={option.value}
                disabled={option.disabled}
                onClick={() => {
                  if (!option.disabled) {
                    onSelect(option.value);
                  }
                }}
                className={cn(
                  "flex items-center justify-between gap-2 text-gray-700",
                  option.disabled && "pointer-events-none opacity-50",
                )}
              >
                {option.label}
                <Check
                  className={cn(
                    "h-4 w-4",
                    option.value === value ? "opacity-100" : "opacity-0",
                  )}
                />
              </DropdownMenuItem>
            );

            if (option.disabled) {
              return (
                <CustomTooltip key={option.value} content="Coming soon">
                  <div className="cursor-not-allowed">{item}</div>
                </CustomTooltip>
              );
            }

            return item;
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BulkActionMenu;
