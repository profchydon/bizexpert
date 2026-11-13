"use client";

import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";

import type { CatalogRule } from "../../types";
import { useCatalogPolicyOptions } from "../../useCatalogPolicyOptions";
import {
  calculateSpecificityScore,
  formatSpecificityTooltip,
} from "../../utils";
import {
  BooleanChoice,
  CompactKitSelectionSection,
  MultiValueField,
} from "./SelectionFields";

export { CompactKitSelectionSection } from "./SelectionFields";

export function PolicyNameSection({
  name,
  nameError,
  onNameChange,
}: {
  name: string;
  nameError: boolean;
  onNameChange: (name: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Policy name</label>
      <Input
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="Senior Engineers - Nigeria"
        data-testid="formfields-input"
      />
      {nameError ? (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          Enter a policy name.
        </p>
      ) : null}
    </div>
  );
}

export function CriteriaFields({
  draft,
  onChange,
}: {
  draft: CatalogRule;
  onChange: (rule: CatalogRule) => void;
}) {
  const { countries, departments, levels } = useCatalogPolicyOptions();
  const score = calculateSpecificityScore(draft);
  const update = (updates: Partial<CatalogRule>) =>
    onChange({ ...draft, ...updates });
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-gray-950">Match criteria</h3>
        <p className="text-sm text-gray-500">
          {formatSpecificityTooltip(draft)}
        </p>
        <p className="mt-1 text-xs font-medium text-gray-700">
          Specificity score: {score}
        </p>
      </div>
      {/* <MultiValueField
        label="Roles"
        options={roles}
        values={draft.matchRoles}
        onChange={(matchRoles) => update({ matchRoles })}
      /> */}
      <MultiValueField
        label="Levels"
        options={levels}
        values={draft.matchLevels}
        onChange={(matchLevels) =>
          update({ matchLevels, matchLevelIds: undefined })
        }
      />
      <MultiValueField
        label="Departments"
        options={departments}
        values={draft.matchDepartments}
        onChange={(matchDepartments) =>
          update({ matchDepartments, matchDepartmentIds: undefined })
        }
      />
      <MultiValueField
        label="Countries"
        options={countries}
        values={draft.matchCountries}
        onChange={(matchCountries) =>
          update({ matchCountries, matchCountryIds: undefined })
        }
      />
    </div>
  );
}

export function BasicPolicyFields({
  draft,
  onChange,
  nameError = false,
}: {
  draft: CatalogRule;
  onChange: (rule: CatalogRule) => void;
  nameError?: boolean;
}) {
  return (
    <div className="space-y-6">
      <PolicyNameSection
        name={draft.name}
        nameError={nameError}
        onNameChange={(name) => onChange({ ...draft, name })}
      />
      <CriteriaFields draft={draft} onChange={onChange} />
    </div>
  );
}

export function TriggerTypeFields({
  triggerType,
  onChange,
}: {
  triggerType: CatalogRule["triggerType"];
  onChange: (value: CatalogRule["triggerType"]) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <BooleanChoice
        checked={triggerType === "MANUAL"}
        onChange={() => onChange("MANUAL")}
        title="Manual"
        body="Run the rule when admins trigger it."
      />
      <BooleanChoice
        checked={triggerType === "HRIS"}
        onChange={() => onChange("HRIS")}
        title="HRIS sync"
        body="Evaluate during HRIS syncs."
      />
    </div>
  );
}

export function SwapBehaviorFields({
  allowItemSwap,
  onChange,
}: {
  allowItemSwap: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <BooleanChoice
      checked={allowItemSwap}
      onChange={onChange}
      title="Allow item swaps"
      body="Employees can choose approved alternatives."
    />
  );
}

export function StorageOptionFields({
  includeStorage,
  onStorageChange,
}: {
  includeStorage: boolean;
  onStorageChange: (value: boolean) => void;
}) {
  return (
    <BooleanChoice
      checked={includeStorage}
      onChange={onStorageChange}
      title="Include company storage"
      body="Include company storage for matched employees."
    />
  );
}
