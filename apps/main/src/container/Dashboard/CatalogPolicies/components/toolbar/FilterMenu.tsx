"use client";

import { useEffect, useRef, useState } from "react";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { RuleFilters } from "../../types";
import { useCatalogPolicyOptions } from "../../useCatalogPolicyOptions";
import { defaultRuleFilters } from "../../utils";
import { FilterMultiSelect } from "./FilterMultiSelect";

type FilterKey = keyof RuleFilters;
type FilterOption = { value: string; label: string };

export function RuleFilterMenu({
  open,
  filters,
  onClose,
  onApply,
}: {
  open: boolean;
  filters: RuleFilters;
  onClose: () => void;
  onApply: (filters: RuleFilters) => void;
}) {
  const [local, setLocal] = useState(filters);
  const [openGroup, setOpenGroup] = useState<FilterKey | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { countries, departments, levels } = useCatalogPolicyOptions();
  const groups: { key: FilterKey; label: string; options: FilterOption[] }[] = [
    { key: "levels", label: "Level", options: levels },
    { key: "departments", label: "Department", options: departments },
    { key: "countries", label: "Country", options: countries },
  ];

  useEffect(() => setLocal(filters), [filters, open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose, open]);

  if (!open) return null;

  function toggle(key: FilterKey, value: string) {
    setLocal((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  function clear(key: FilterKey) {
    setLocal((current) => ({ ...current, [key]: [] }));
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-[340px] rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <h3 className="text-base font-semibold text-gray-900">Filters</h3>
      </div>
      <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-5">
        {groups.map((group) => (
          <FilterMultiSelect
            key={group.key}
            label={group.label}
            options={group.options}
            selected={local[group.key]}
            open={openGroup === group.key}
            onOpenChange={(open) => setOpenGroup(open ? group.key : null)}
            onClear={() => clear(group.key)}
            onToggle={(value) => toggle(group.key, value)}
          />
        ))}
      </div>
      <div className="px-5 py-3">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <button
            type="button"
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-900"
            onClick={() => setLocal(defaultRuleFilters)}
          >
            Reset
          </button>
          <Button
            size="sm"
            onClick={() => {
              onApply({ ...local, roles: [] });
              onClose();
            }}
            className="gap-2 text-sm"
            data-testid="filtermenu-button"
          >
            <ListFilter className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
