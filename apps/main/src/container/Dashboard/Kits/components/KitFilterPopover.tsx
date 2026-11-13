"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FulfillmentMode } from "../types";

export interface KitFilters {
  fulfillmentModes: FulfillmentMode[];
}

export const defaultKitFilters: KitFilters = { fulfillmentModes: [] };

const options: { value: FulfillmentMode; label: string }[] = [
  { value: "split", label: "Split OK" },
  { value: "hold", label: "Hold Until Complete" },
];

interface Props {
  filters: KitFilters;
  resultCount: number;
  onApply: (filters: KitFilters) => void;
  onClose: () => void;
}

const KitFilterPopover = ({
  filters,
  resultCount,
  onApply,
  onClose,
}: Props) => {
  const toggle = (value: FulfillmentMode) => {
    const exists = filters.fulfillmentModes.includes(value);
    const next = exists
      ? filters.fulfillmentModes.filter((mode) => mode !== value)
      : [...filters.fulfillmentModes, value];
    onApply({ fulfillmentModes: next });
  };

  const hasActive = filters.fulfillmentModes.length > 0;

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[300px] rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="border-b border-gray-200 px-5 py-3">
        <h3 className="text-base font-semibold text-gray-900">Filters</h3>
      </div>
      <div className="space-y-3 p-5">
        <span className="text-sm font-semibold text-gray-700">
          Fulfillment Mode
        </span>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const selected = filters.fulfillmentModes.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggle(option.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
                  selected
                    ? "border-primary-700 bg-primary-50 text-primary-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                )}
              >
                {selected && <Check className="size-3.5" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApply(defaultKitFilters)}
          data-testid="kitfilterpopover-button"
        >
          Reset
        </Button>
        <Button
          size="sm"
          onClick={onClose}
          data-testid="kitfilterpopover-button-2"
        >
          Apply{hasActive ? ` (${resultCount})` : ""}
        </Button>
      </div>
    </div>
  );
};

export default KitFilterPopover;
