import type {
  CatalogRule,
  ConflictResult,
  ImpactPreviewRow,
  MockEmployee,
} from "./types";

export function calculateSpecificityScore(criteria: {
  matchCountries: string[];
  matchRoles: string[];
  matchLevels: string[];
}) {
  let score = 0;
  if (criteria.matchCountries.length > 0) score += 3;
  if (criteria.matchRoles.length > 0) score += 2;
  if (criteria.matchLevels.length > 0) score += 1;
  return score;
}

export function formatSpecificityTooltip(criteria: {
  matchCountries: string[];
  matchRoles: string[];
  matchLevels: string[];
}) {
  const parts: string[] = [];
  if (criteria.matchCountries.length > 0) parts.push("Country: 3");
  if (criteria.matchRoles.length > 0) parts.push("Role: 2");
  if (criteria.matchLevels.length > 0) parts.push("Level: 1");
  const score = calculateSpecificityScore(criteria);
  return parts.length === 0
    ? "Score: 0. No criteria selected."
    : `Score: ${score}. ${parts.join(" + ")}. Higher = more specific match.`;
}

export function matchesEmployee(rule: CatalogRule, employee: MockEmployee) {
  if (rule.matchRoles.length > 0 && !rule.matchRoles.includes(employee.role)) {
    return false;
  }
  if (
    rule.matchLevels.length > 0 &&
    !rule.matchLevels.includes(employee.level)
  ) {
    return false;
  }
  if (
    rule.matchDepartments.length > 0 &&
    !rule.matchDepartments.includes(employee.department)
  ) {
    return false;
  }
  if (
    rule.matchCountries.length > 0 &&
    !rule.matchCountries.includes(employee.country)
  ) {
    return false;
  }
  return true;
}

function criteriaOverlap(a: CatalogRule, b: CatalogRule) {
  const dimensions = [
    [a.matchRoles, b.matchRoles],
    [a.matchLevels, b.matchLevels],
    [a.matchDepartments, b.matchDepartments],
    [a.matchCountries, b.matchCountries],
  ];
  if (
    dimensions.some(
      ([left, right]) =>
        left.length > 0 &&
        right.length > 0 &&
        !left.some((value) => right.includes(value)),
    )
  ) {
    return null;
  }
  const parts = dimensions
    .map(([left, right]) =>
      left.length > 0 && right.length > 0
        ? left.filter((value) => right.includes(value)).join(", ")
        : "",
    )
    .filter(Boolean);
  return parts.join(" · ") || "all criteria";
}

export function detectConflicts(
  current: CatalogRule,
  otherRules: CatalogRule[],
  employees: MockEmployee[],
): ConflictResult[] {
  const results: ConflictResult[] = [];
  for (const other of otherRules) {
    if (other.id === current.id || other.status === "ARCHIVED") continue;
    const overlap = criteriaOverlap(current, other);
    if (!overlap) continue;
    const affectedEmployees = employees
      .filter(
        (employee) =>
          matchesEmployee(current, employee) &&
          matchesEmployee(other, employee),
      )
      .map((employee) => ({ id: employee.id, name: employee.name }));
    if (affectedEmployees.length === 0) continue;
    const scoreDiff = current.specificityScore - other.specificityScore;
    results.push({
      severity: scoreDiff === 0 ? "RED" : "AMBER",
      currentWins: scoreDiff > 0,
      conflictingRuleId: other.id,
      conflictingRuleName: other.name,
      overlapDescription: overlap,
      affectedEmployees,
    });
  }
  return results;
}

export function calculateImpact(
  current: CatalogRule,
  otherRules: CatalogRule[],
  employees: MockEmployee[],
): ImpactPreviewRow[] {
  return employees
    .filter((employee) => matchesEmployee(current, employee))
    .map((employee) => {
      const existingRule = otherRules.find(
        (rule) =>
          rule.id !== current.id &&
          rule.status !== "ARCHIVED" &&
          matchesEmployee(rule, employee),
      );
      if (
        existingRule &&
        existingRule.specificityScore < current.specificityScore
      ) {
        return {
          employeeId: employee.id,
          employeeName: employee.name,
          role: employee.role,
          level: employee.level,
          country: employee.country,
          countryCode: employee.countryCode,
          currentMatchedBy: existingRule.name,
          impact: "displacement",
          displacedFrom: existingRule.name,
        };
      }
      return {
        employeeId: employee.id,
        employeeName: employee.name,
        role: employee.role,
        level: employee.level,
        country: employee.country,
        countryCode: employee.countryCode,
        currentMatchedBy: existingRule?.name ?? null,
        impact: "new_coverage",
      };
    });
}
