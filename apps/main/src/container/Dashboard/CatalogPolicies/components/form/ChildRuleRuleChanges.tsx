"use client";

import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

import type { CatalogRule } from "../../types";
import { useCatalogPolicyOptions } from "../../useCatalogPolicyOptions";
import {
  getChildRuleLimitViolations,
  type ChildRuleDraft,
} from "../../utilsChildRule";
import { shouldShowChildRuleCategoryLimits } from "../../utilsChildRuleModal";
import { describeChildRuleScope } from "../../utilsChildRuleScope";
import { ChildRuleCategoryLimits } from "./ChildRuleCategoryLimits";
import { EditorNote, SelectField } from "./ChildRuleEditorFields";
import { OverrideCard } from "./ChildRuleOverrideCard";

const storageOptions = [
  { id: "EXCLUDE", label: "Exclude company storage" },
  { id: "INCLUDE", label: "Include company storage" },
];

export function ChildRuleRuleChanges({
  draft,
  parent,
  onChange,
}: {
  draft: ChildRuleDraft;
  parent: CatalogRule;
  onChange: (draft: ChildRuleDraft) => void;
}) {
  const { countries, departments, kits, levels, roles } =
    useCatalogPolicyOptions();
  const parentKitIds = new Set(parent.kitIds);
  const scopedKits = kits.filter((kit) => parentKitIds.has(kit.id));
  const hasNarrowing =
    draft.narrowRoles.length +
      draft.narrowLevels.length +
      draft.narrowDepartments.length +
      draft.narrowCountries.length >
    0;
  const needsNarrowing =
    (draft.overrideTrigger ||
      draft.overrideStorage ||
      draft.overrideItemSwap) &&
    !hasNarrowing;
  const showCategoryLimits = shouldShowChildRuleCategoryLimits({
    selectionMode: parent.selectionMode,
    overrideKit: draft.overrideKit,
    kitIds: draft.kitIds,
  });
  const limitViolations = getChildRuleLimitViolations(draft, parent);
  const limitErrors = new Map(
    limitViolations.map((violation) => [violation.key, violation.message]),
  );

  return (
    <div className="flex flex-col gap-5">
      <EditorNote title="Match criteria">
        {describeChildRuleScope(draft, {
          countries,
          departments,
          levels,
          roles,
        })}
      </EditorNote>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-normal text-gray-700">Policy changes</p>
        <p className="text-sm text-gray-500">
          Choose what to override for employees that match this criteria.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <OverrideCard
          selected={draft.overrideKit}
          onToggle={(overrideKit) =>
            onChange({
              ...draft,
              overrideKit,
              overrideCategoryLimits: overrideKit
                ? draft.overrideCategoryLimits
                : false,
            })
          }
          label="Assign kit"
          hint="Override the kit assigned to employees in this scope."
        >
          <SelectField
            label="Kit"
            value={draft.kitIds[0] ?? ""}
            placeholder="Select a kit"
            options={scopedKits.map((kit) => ({
              id: kit.id,
              label: `${kit.name} · ${kit.itemsCount ?? kit.items.length} items`,
            }))}
            onChange={(kitId) => onChange({ ...draft, kitIds: [kitId] })}
          />
        </OverrideCard>
        <HrisSyncToggle
          checked={draft.overrideTrigger && draft.triggerType === "HRIS"}
          onChange={(checked) =>
            onChange({
              ...draft,
              overrideTrigger: checked,
              triggerType: checked ? "HRIS" : draft.triggerType,
            })
          }
        />
        <OverrideCard
          selected={draft.overrideStorage}
          onToggle={(overrideStorage) =>
            onChange({ ...draft, overrideStorage })
          }
          label="Storage policy"
          hint="Override whether company storage is included."
        >
          <SelectField
            label="Storage policy"
            value={draft.storageInclude ? "INCLUDE" : "EXCLUDE"}
            options={storageOptions}
            onChange={(value) =>
              onChange({
                ...draft,
                storageInclude: value !== "EXCLUDE",
              })
            }
          />
        </OverrideCard>
        <OverrideCard
          selected={draft.overrideItemSwap}
          onToggle={(overrideItemSwap) =>
            onChange({ ...draft, overrideItemSwap, allowItemSwap: false })
          }
          label="Disallow item swap"
          hint="Prevent approvers from swapping items for alternatives in this scope."
        />
        {showCategoryLimits ? (
          <OverrideCard
            selected={draft.overrideCategoryLimits}
            onToggle={(overrideCategoryLimits) =>
              onChange({ ...draft, overrideCategoryLimits })
            }
            label="Override category limits"
            hint="Replace the parent policy's per-category min/max with values for this scope."
          >
            <ChildRuleCategoryLimits
              limits={draft.categoryLimits}
              errors={limitErrors}
              onChange={(categoryLimits) =>
                onChange({ ...draft, categoryLimits })
              }
            />
          </OverrideCard>
        ) : null}
        {needsNarrowing ? (
          <div className="flex items-start gap-2 rounded-xl border border-gray-200 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <p className="text-sm text-gray-500">
              To override storage or item swap, narrow the match criteria above
              (e.g. roles, levels, departments, or countries)
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function HrisSyncToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-2 rounded-xl border p-4 text-left transition",
        checked
          ? "border-primary-600 bg-primary-50"
          : "border-gray-200 bg-white",
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition",
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
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium text-gray-700">HRIS sync</span>
        <span className="text-sm leading-5 text-gray-500">
          Automatically sync with the HRIS and trigger this rule when a new
          employee is added, based on their start date.
        </span>
      </span>
    </button>
  );
}
