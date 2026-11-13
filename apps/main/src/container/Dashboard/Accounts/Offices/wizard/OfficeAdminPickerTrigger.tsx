"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { WizardAdminOption } from "../../components/wizard/WizardAdminOptionList";
import { wizardFieldTriggerClass } from "../../components/wizard/wizardFieldClasses";

interface Props {
  open: boolean;
  isLoading: boolean;
  invalid?: boolean;
  triggerClassName?: string;
  selectedOptions: WizardAdminOption[];
  onRemove: (admin: string, event: React.MouseEvent) => void;
}

export function OfficeAdminPickerTrigger({
  open,
  isLoading,
  invalid,
  triggerClassName,
  selectedOptions,
  onRemove,
}: Props) {
  const hasSelection = selectedOptions.length > 0;

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          wizardFieldTriggerClass,
          triggerClassName,
          "justify-between gap-2 text-left",
          hasSelection ? "min-h-[44px] h-auto flex-wrap py-2" : "text-gray-500",
          open && "border-primary-600 ring-2 ring-primary-600/20",
          invalid && !open && "border-error-500",
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {hasSelection ? (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
              >
                {option.label}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => onRemove(option.value, event)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onRemove(
                        option.value,
                        event as unknown as React.MouseEvent,
                      );
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="size-3" />
                </span>
              </span>
            ))
          ) : (
            <span>Assign admins</span>
          )}
        </span>
        {isLoading ? (
          <Loader2
            className="size-4 shrink-0 animate-spin text-gray-400"
            aria-hidden
          />
        ) : (
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </button>
    </PopoverTrigger>
  );
}
