import { SelectTags } from "./SelectTags";
import type { CatalogRule } from "../../types";
import { formatSpecificityTooltip } from "../../utils";
import {
  type CatalogOption,
  useCatalogPolicyOptions,
} from "../../useCatalogPolicyOptions";

export function CriteriaFields({
  draft,
  onChange,
}: {
  draft: CatalogRule;
  onChange: (rule: CatalogRule) => void;
}) {
  const { countries, departments, levels, roles } = useCatalogPolicyOptions();
  const countryFlagUrls = Object.fromEntries(
    countries
      .filter((country) => country.code)
      .map((country) => [
        country.value,
        `https://www.untitledui.com/images/flags/${country.code}.svg`,
      ]),
  );
  const rolesSelection = criteriaSelection(
    draft.matchRoles,
    draft.matchRoleIds,
    roles,
  );
  const levelsSelection = criteriaSelection(
    draft.matchLevels,
    draft.matchLevelIds,
    levels,
  );
  const departmentsSelection = criteriaSelection(
    draft.matchDepartments,
    draft.matchDepartmentIds,
    departments,
  );
  const countriesSelection = criteriaSelection(
    draft.matchCountries,
    draft.matchCountryIds,
    countries,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900">
          Match Criteria
        </h2>
        <div
          title={formatSpecificityTooltip(draft)}
          className="flex items-center gap-1.5 text-sm text-gray-500"
        >
          Specificity:
          <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
            {draft.specificityScore}
          </span>
        </div>
      </div>
      <SelectTags
        label="Roles"
        hint="Leave empty to match every role."
        options={roles}
        selected={rolesSelection.values}
        onChange={(matchRoles) =>
          onChange({
            ...draft,
            matchRoles: valuesToLabels(matchRoles, roles),
            matchRoleIds: matchRoles,
          })
        }
      />
      <SelectTags
        label="Levels"
        hint="Leave empty to match every level."
        options={levels}
        selected={levelsSelection.values}
        onChange={(matchLevels) =>
          onChange({
            ...draft,
            matchLevels: valuesToLabels(matchLevels, levels),
            matchLevelIds: matchLevels,
          })
        }
      />
      <SelectTags
        label="Departments"
        hint="Leave empty to match every department."
        options={departments}
        selected={departmentsSelection.values}
        onChange={(matchDepartments) =>
          onChange({
            ...draft,
            matchDepartments: valuesToLabels(matchDepartments, departments),
            matchDepartmentIds: matchDepartments,
          })
        }
      />
      <SelectTags
        label="Countries"
        hint="Leave empty to apply globally."
        options={countries}
        selected={countriesSelection.values}
        iconUrls={countryFlagUrls}
        onChange={(matchCountries) =>
          onChange({
            ...draft,
            matchCountries: valuesToLabels(matchCountries, countries),
            matchCountryIds: matchCountries,
          })
        }
      />
    </div>
  );
}

function criteriaSelection(
  labels: string[],
  ids: string[] | undefined,
  options: CatalogOption[],
) {
  return {
    values: ids ?? labelsToValues(labels, options),
  };
}

function labelsToValues(labels: string[], options: CatalogOption[]) {
  const valueByLabel = new Map(
    options.map((option) => [option.label, option.value]),
  );
  return labels.map((label) => valueByLabel.get(label) ?? label);
}

function valuesToLabels(values: string[], options: CatalogOption[]) {
  const labelByValue = new Map(
    options.map((option) => [option.value, option.label]),
  );
  return values.map((value) => labelByValue.get(value) ?? value);
}
