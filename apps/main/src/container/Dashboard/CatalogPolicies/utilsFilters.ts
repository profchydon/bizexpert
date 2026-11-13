import type { CatalogRule, RuleFilters, RuleStatusFilter } from "./types";

export const defaultRuleFilters: RuleFilters = {
  roles: [],
  levels: [],
  departments: [],
  countries: [],
};

export const ruleStatusOptions: RuleStatusFilter[] = [
  "All",
  "Draft",
  "Active",
  "Archived",
];

export function getRuleFilterCount(filters: RuleFilters) {
  return (
    filters.levels.length +
    filters.departments.length +
    filters.countries.length
  );
}

export function filterOptionsByQuery<T extends { label: string }>(
  options: T[],
  query: string,
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return options;
  return options.filter((option) =>
    option.label.toLowerCase().includes(normalized),
  );
}

export function filterRules(args: {
  rules: CatalogRule[];
  search: string;
  statusFilter: RuleStatusFilter;
  filters: RuleFilters;
}) {
  const query = args.search.trim().toLowerCase();
  return args.rules.filter((rule) => {
    const matchesSearch =
      query === "" ||
      rule.name.toLowerCase().includes(query) ||
      rule.kitIds.some((id) => id.toLowerCase().includes(query));
    const matchesStatus =
      args.statusFilter === "All" ||
      (args.statusFilter === "Draft" && rule.status === "DRAFT") ||
      (args.statusFilter === "Active" && rule.status === "ACTIVE") ||
      (args.statusFilter === "Archived" && rule.status === "ARCHIVED");
    const matchesFilters =
      dimensionMatches(rule.matchLevels, args.filters.levels) &&
      dimensionMatches(rule.matchDepartments, args.filters.departments) &&
      dimensionMatches(rule.matchCountries, args.filters.countries);
    return matchesSearch && matchesStatus && matchesFilters;
  });
}

function dimensionMatches(ruleValues: string[], selected: string[]) {
  if (selected.length === 0) return true;
  if (ruleValues.length === 0) return false;
  return ruleValues.some((value) => selected.includes(value));
}
