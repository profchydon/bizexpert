"use client";

import { cn } from "@/lib/utils";

import type { CatalogRule } from "../../types";
import { WizardBudgetApproval } from "./BudgetApproval";
import { ConflictDetectionBanner } from "./ConflictDetectionBanner";
import { WizardKitSelect } from "./KitSelect";
import type { useCreatePolicyConflictCheck } from "./useCreatePolicyConflictCheck";

type CreatePolicyConflictState = ReturnType<
  typeof useCreatePolicyConflictCheck
>;
const emptyConflicts: CreatePolicyConflictState = {
  acknowledged: false,
  acknowledgeDisplacement: false,
  conflicts: [],
  hasConflicts: false,
  isBlocked: false,
  isChecking: false,
  requiresAcknowledgment: false,
  setAcknowledged: () => undefined,
};

export function WizardKitStorage({
  conflicts = emptyConflicts,
  draft,
  currencySymbol,
  onChange,
}: {
  conflicts?: CreatePolicyConflictState;
  draft: CatalogRule;
  currencySymbol: string;
  onChange: (rule: CatalogRule) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <WizardKitSelect
        selected={draft.kitIds}
        onChange={(kitIds) => onChange({ ...draft, kitIds })}
      />
      <Divider />
      <WizardBudgetApproval
        draft={draft}
        currencySymbol={currencySymbol}
        onChange={onChange}
      />
      <Divider />
      <ToggleCard
        checked={draft.allowItemSwap}
        title="Allow item swap"
        description="Enables the approver to swap items for alternatives in the same category"
        onChange={(allowItemSwap) => onChange({ ...draft, allowItemSwap })}
      />
      <Divider />
      <ToggleCard
        checked={draft.includeCompanyStorage}
        title="Include company storage"
        description="Check company storage inventory before sourcing from marketplace"
        onChange={(includeCompanyStorage) =>
          onChange({ ...draft, includeCompanyStorage })
        }
      />
      <ConflictDetectionBanner
        acknowledged={conflicts.acknowledged}
        conflicts={conflicts.conflicts}
        onAcknowledge={conflicts.setAcknowledged}
        requiresAcknowledgment={conflicts.requiresAcknowledgment}
      />
    </div>
  );
}

function ToggleCard({
  checked,
  title,
  description,
  onChange,
}: {
  checked: boolean;
  title: string;
  description: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition",
        checked
          ? "border-primary-600 bg-primary-50"
          : "border-gray-200 bg-white",
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5",
          checked ? "bg-primary-600" : "bg-gray-100",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </span>
      <span>
        <span className="block text-sm font-medium text-gray-700">{title}</span>
        <span className="block text-sm text-gray-500">{description}</span>
      </span>
    </button>
  );
}

function Divider() {
  return <div className="h-px w-full shrink-0 bg-gray-200" />;
}
