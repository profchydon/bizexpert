"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

import { useCatalogPolicyOptions } from "../../useCatalogPolicyOptions";
import { formatMoney } from "../../utils";

export function MultiValueField({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: (string | { value: string; label: string })[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  const labelByValue = Object.fromEntries(
    normalized.map((option) => [option.value, option.label]),
  );
  const selected = values.length
    ? values.map((value) => labelByValue[value] ?? value).join(", ")
    : `All ${label.toLowerCase()}`;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">{selected}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {normalized.map((option) => {
          const active = values.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(
                  active
                    ? values.filter((item) => item !== option.value)
                    : [...values, option.value],
                )
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition",
                active
                  ? "border-gray-950 bg-gray-950 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-400",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CompactKitSelectionSection({
  selectedKitIds,
  onKitsChange,
}: {
  selectedKitIds: string[];
  onKitsChange: (kitIds: string[]) => void;
}) {
  const { kits } = useCatalogPolicyOptions();
  const currencySymbol = useWorkspaceCurrencySymbol();

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-gray-950">Kits</h3>
        <p className="text-sm text-gray-500">
          Choose one or more kits eligible employees can use.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {kits.map((kit) => {
          const active = selectedKitIds.includes(kit.id);
          return (
            <button
              key={kit.id}
              type="button"
              onClick={() =>
                onKitsChange(
                  active
                    ? selectedKitIds.filter((id) => id !== kit.id)
                    : [...selectedKitIds, kit.id],
                )
              }
              className={cn(
                "rounded-xl border p-4 text-left transition",
                active
                  ? "border-gray-950 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-medium text-gray-950">{kit.name}</span>
                {active ? <Check className="h-4 w-4" /> : null}
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                {kit.description}
              </span>
              <span className="mt-2 block text-sm font-medium">
                {formatMoney(kit.totalCost, currencySymbol)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BooleanChoice({
  checked,
  onChange,
  title,
  body,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  body: string;
}) {
  return (
    <Button
      type="button"
      variant={checked ? "default" : "outline"}
      className="h-auto justify-start p-4 text-left"
      onClick={() => onChange(!checked)}
      data-testid="selectionfields-button"
    >
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-xs opacity-80">{body}</span>
      </span>
    </Button>
  );
}
