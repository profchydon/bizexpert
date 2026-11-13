"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IPlan } from "@/types/plans";
import { planPriceLabel } from "../../lib/planPricing";

export function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: IPlan;
  selected: boolean;
  onSelect: () => void;
}) {
  const price = planPriceLabel(plan);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl border p-5 text-left transition duration-150",
        selected
          ? "border-primary-600 bg-primary-600 ring-1 ring-primary-600"
          : "border-gray-200 bg-white hover:border-primary-200 hover:bg-gray-50",
      )}
    >
      <div>
        <p
          className={cn(
            "text-sm font-bold",
            selected ? "text-white" : "text-gray-900",
          )}
        >
          {plan.name}
        </p>
        <p className="mt-1">
          <span
            className={cn(
              "text-xl font-bold",
              selected ? "text-white" : "text-primary-600",
            )}
          >
            {price.amount}
          </span>
          {price.suffix && (
            <span
              className={cn(
                "ml-1 text-xs",
                selected ? "text-primary-200" : "text-gray-500",
              )}
            >
              {price.suffix}
            </span>
          )}
        </p>
        {plan.description && (
          <p
            className={cn(
              "mt-2 text-xs leading-relaxed",
              selected ? "text-primary-100" : "text-gray-500",
            )}
          >
            {plan.description}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-1.5">
        {(plan.offers ?? []).map((offer) => (
          <li
            key={offer}
            className={cn(
              "flex items-start gap-2 text-xs",
              selected ? "text-primary-100" : "text-gray-700",
            )}
          >
            <Check
              className={cn(
                "mt-0.5 size-3 shrink-0",
                selected ? "text-white" : "text-primary-600",
              )}
            />
            {offer}
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-auto rounded-lg py-2 text-center text-sm font-semibold transition",
          selected
            ? "bg-white text-primary-700"
            : "border border-primary-300 text-primary-700 hover:bg-primary-50",
        )}
      >
        Select
      </div>
    </button>
  );
}
