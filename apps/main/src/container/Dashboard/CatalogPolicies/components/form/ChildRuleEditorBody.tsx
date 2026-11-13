"use client";

import { Input } from "@/components/ui/input";

import type { CatalogRule } from "../../types";
import { useCatalogPolicyOptions } from "../../useCatalogPolicyOptions";
import type { ChildRuleDraft } from "../../utilsChildRule";
import { scopedOptions } from "../../utilsOptionScope";
import { EditorNote } from "./ChildRuleEditorFields";
import { MultiPickField } from "./ChildRuleMultiPickField";
import { ChildRuleRuleChanges } from "./ChildRuleRuleChanges";

export function ChildRuleEditorBody({
  step,
  draft,
  parent,
  onChange,
}: {
  step: 1 | 2;
  draft: ChildRuleDraft;
  parent: CatalogRule;
  onChange: (draft: ChildRuleDraft) => void;
}) {
  const options = useCatalogPolicyOptions();
  if (step === 2) {
    return (
      <ChildRuleRuleChanges draft={draft} parent={parent} onChange={onChange} />
    );
  }

  // const roles = scopedOptions(options.roles, parent.matchRoles);
  const levels = scopedOptions(options.levels, parent.matchLevels);
  const departments = scopedOptions(
    options.departments,
    parent.matchDepartments,
  );
  const countries = scopedOptions(options.countries, parent.matchCountries);
  const levelValues =
    draft.narrowLevelIds ?? valuesFromLabels(draft.narrowLevels, levels);
  const departmentValues =
    draft.narrowDepartmentIds ??
    valuesFromLabels(draft.narrowDepartments, departments);
  const countryValues =
    draft.narrowCountryIds ??
    valuesFromLabels(draft.narrowCountries, countries);

  return (
    <div className="flex flex-col gap-5">
      <EditorNote title="Match criteria">
        Leave any field empty to inherit from{" "}
        <span className="font-medium text-gray-700">{parent.name}</span>.
      </EditorNote>

      <label className="flex flex-col gap-1.5 text-sm font-normal text-gray-700">
        Policy name
        <Input
          value={draft.name}
          placeholder={`e.g. ${parent.name} - override`}
          maxLength={80}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          data-testid="childruleeditorbody-input"
        />
        <span className="text-sm font-normal text-gray-500">
          Required for creating a sub policy.
        </span>
      </label>

      <div className="flex flex-col gap-3">
        {/* <MultiPickField
          label="Roles"
          placeholder="Select roles"
          options={roles}
          values={draft.narrowRoles}
          onChange={(narrowRoles) => onChange({ ...draft, narrowRoles })}
        /> */}
        <MultiPickField
          label="Levels"
          placeholder="Select levels"
          options={levels}
          values={levelValues}
          onChange={(narrowLevelIds) =>
            onChange({
              ...draft,
              narrowLevels: labelsFromValues(narrowLevelIds, levels),
              narrowLevelIds,
            })
          }
        />
        <MultiPickField
          label="Departments"
          placeholder="Select departments"
          options={departments}
          values={departmentValues}
          onChange={(narrowDepartments) =>
            onChange({
              ...draft,
              narrowDepartments: labelsFromValues(
                narrowDepartments,
                departments,
              ),
              narrowDepartmentIds: narrowDepartments,
            })
          }
        />
        <MultiPickField
          label="Countries"
          placeholder="Select countries"
          options={countries}
          values={countryValues}
          onChange={(narrowCountries) =>
            onChange({
              ...draft,
              narrowCountries: labelsFromValues(narrowCountries, countries),
              narrowCountryIds: narrowCountries,
            })
          }
        />
      </div>
    </div>
  );
}

function labelsFromValues(
  values: string[],
  options: { value: string; label: string }[],
) {
  const labelByValue = new Map(
    options.map((option) => [option.value, option.label]),
  );
  return values.map((value) => labelByValue.get(value) ?? value);
}

function valuesFromLabels(
  labels: string[],
  options: { value: string; label: string }[],
) {
  const valueByLabel = new Map(
    options.map((option) => [option.label, option.value]),
  );
  return labels.map((label) => valueByLabel.get(label) ?? label);
}
