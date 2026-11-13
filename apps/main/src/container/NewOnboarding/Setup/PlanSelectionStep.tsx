"use client";

import PageState from "@/components/PageState";
import type { IPlan } from "@/types/plans";
import { STEP_META, TOTAL_STEPS } from "../data/stepMeta";
import type { CatalogGroup } from "../lib/catalogPlans";
import { billingSummary } from "../lib/planPresentation";
import { FeatureComparisonTable } from "./components/FeatureComparisonTable";
import { PlanCard } from "./components/PlanCard";

export function PlanSelectionStep({
  plans,
  groups,
  isLoading,
  isError,
  selected,
  onSelect,
}: {
  plans: IPlan[];
  groups: CatalogGroup[];
  isLoading: boolean;
  isError: boolean;
  selected: string;
  onSelect: (slug: string) => void;
}) {
  const meta = STEP_META[4];
  const summary = billingSummary(plans);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
          Step 5 of {TOTAL_STEPS} · Plan selection
        </p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          {meta.heading}
        </h2>
        {summary ? (
          <p className="mt-1.5 text-sm text-gray-500">{summary}</p>
        ) : null}
      </div>

      <PageState
        isLoading={isLoading}
        isError={isError}
        errorMessage="We couldn't load plans. Please try again."
      >
        <div className="grid grid-cols-2 gap-4 pt-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.slug}
              plan={plan}
              selected={selected === plan.slug}
              onSelect={() => onSelect(plan.slug)}
            />
          ))}
        </div>

        <FeatureComparisonTable
          plans={plans}
          groups={groups}
          onSelect={onSelect}
        />
      </PageState>
    </div>
  );
}
