import type { CatalogOption } from "./useCatalogPolicyOptions";
import type { ChildRuleDraft } from "./utilsChildRule";

type LabelOptions = {
  roles?: CatalogOption[];
  levels?: CatalogOption[];
  departments?: CatalogOption[];
  countries?: CatalogOption[];
};

export function describeChildRuleScope(
  draft: ChildRuleDraft,
  options: LabelOptions = {},
) {
  const parts: string[] = [];
  appendScopePart(parts, "Role", draft.narrowRoles, options.roles);
  appendScopePart(parts, "Level", draft.narrowLevels, options.levels);
  appendScopePart(parts, "Dept", draft.narrowDepartments, options.departments);
  appendScopePart(parts, "Country", draft.narrowCountries, options.countries);
  return parts.length ? parts.join(" · ") : "Inheriting parent scope";
}

function appendScopePart(
  parts: string[],
  label: string,
  values: string[],
  options: CatalogOption[] = [],
) {
  if (!values.length) return;
  const labelByValue = new Map(
    options.map((option) => [option.value, option.label]),
  );
  parts.push(
    `${label}: ${values.map((value) => labelByValue.get(value) ?? value).join(", ")}`,
  );
}
