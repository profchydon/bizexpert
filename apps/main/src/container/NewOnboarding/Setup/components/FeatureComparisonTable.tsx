"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IPlan } from "@/types/plans";
import { visibleComparisonGroups } from "@/container/Dashboard/Settings/Subscription/visibleComparison";
import type { CatalogFeatureCell, CatalogGroup } from "../../lib/catalogPlans";
import { planPriceLabel } from "../../lib/planPricing";

function columnLabel(plan: IPlan) {
  const price = planPriceLabel(plan);
  return `${plan.name} (${price.amount})`;
}

function FeatureCell({ cell }: { cell: CatalogFeatureCell | undefined }) {
  if (!cell || cell.kind === "excluded") {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
        <X className="size-3 text-gray-400" strokeWidth={3} />
      </span>
    );
  }
  if (cell.kind === "included") {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-600">
        <Check className="size-3 text-white" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="text-xs font-medium text-gray-700">
      {cell.label || (cell.kind === "addon" ? "Add-on" : "—")}
    </span>
  );
}

export function FeatureComparisonTable({
  plans,
  groups,
  onSelect,
}: {
  plans: IPlan[];
  groups: CatalogGroup[];
  onSelect: (slug: string) => void;
}) {
  const [activeKey, setActiveKey] = useState("");
  const visible = visibleComparisonGroups(groups);
  const category = visible.find((item) => item.key === activeKey) ?? visible[0];

  if (!category) return null;

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-gray-200 p-5">
      <p className="text-base font-bold text-gray-900">
        Compare Features By Category
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-1 border-b border-gray-200">
        {visible.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveKey(item.key)}
            className={cn(
              "-mb-px pb-2.5 text-sm transition",
              category.key === item.key
                ? "border-b-2 border-primary-600 font-semibold text-primary-600"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="w-1/3 pb-3 text-xs font-medium text-gray-500">
                {category.name}
              </th>
              {plans.map((plan) => (
                <th key={plan.slug} className="pb-3 text-center">
                  <p className="text-xs font-medium text-gray-700">
                    {columnLabel(plan)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelect(plan.slug)}
                    className="text-xs font-semibold text-primary-600 hover:underline"
                  >
                    Select
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {category.features.map((row) => (
              <tr key={row.code}>
                <td className="py-3 text-xs text-gray-600">{row.name}</td>
                {plans.map((plan) => (
                  <td key={plan.slug} className="py-3 text-center">
                    <FeatureCell
                      cell={row.cells.find((cell) => cell.plan === plan.slug)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
