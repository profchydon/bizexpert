"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import { WizardRadioIndicator } from "./WizardRadioIndicator";

interface Props {
  value: string;
  selected: boolean;
  label: string;
  description: string;
}

export function WizardRadioCard({
  value,
  selected,
  label,
  description,
}: Props) {
  return (
    <RadioGroupPrimitive.Item value={value} asChild>
      <button
        type="button"
        className={cn(
          "relative flex w-full cursor-pointer items-start rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/20 focus-visible:ring-offset-2",
          selected
            ? "border-primary-600 bg-primary-50 ring-1 ring-inset ring-primary-600"
            : "border-gray-200 bg-white hover:border-gray-300",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-8">
          <p
            className={cn(
              "text-sm font-semibold",
              selected ? "text-primary-700" : "text-gray-900",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "text-sm",
              selected ? "text-primary-700" : "text-gray-600",
            )}
          >
            {description}
          </p>
        </div>
        <WizardRadioIndicator
          selected={selected}
          className="absolute right-4 top-4"
        />
      </button>
    </RadioGroupPrimitive.Item>
  );
}
