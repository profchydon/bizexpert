import type { IEmployees } from "@/types/employees";
import type {
  CatalogPolicyImpactedEmployee,
  CatalogRuleConflict,
} from "@/types/catalogPolicy";
import type { CatalogTriggerHistory } from "@/types/catalogPolicyHistory";

import type {
  ConflictResult,
  EmployeeSelection,
  ImpactPreviewRow,
  RuleRunEntry,
} from "./types";
import { getRunDetailNotes } from "./utilsRunDetail";

export function conflictToResult(
  conflict: CatalogRuleConflict,
): ConflictResult {
  return {
    severity: conflict.type === "red" ? "RED" : "AMBER",
    currentWins: conflict.direction === "outranks_existing",
    conflictingRuleId: conflict.rule_id,
    conflictingRuleName: conflict.rule_name ?? "Untitled rule",
    overlapDescription: conflict.message ?? "Matching criteria overlap",
    affectedEmployees: (conflict.sample_employees ?? []).map((employee) => ({
      id: employee.id,
      name: employeeName(employee),
    })),
  };
}

export function impactedToImpactRows({
  impacted,
  employees,
}: {
  impacted: CatalogPolicyImpactedEmployee[];
  employees: IEmployees[];
}): ImpactPreviewRow[] {
  const employeeMap = new Map(
    employees.map((employee) => [String(employee.id), employee]),
  );
  return impacted.map((employee) => {
    const fullEmployee = employeeMap.get(employee.id);
    return {
      employeeId: employee.id,
      employeeName: employeeName(employee),
      role: fullEmployee?.job_title ?? employee.job_title ?? "Not set",
      level: fullEmployee?.level ?? employee.level ?? "Not set",
      country:
        fullEmployee?.country ??
        employee.country ??
        employee.country_id ??
        "Not set",
      countryCode: fullEmployee?.country_code ?? employee.country_code ?? "",
      currentMatchedBy: null,
      impact: "new_coverage",
    };
  });
}

export function historyToRunEntry(
  history: CatalogTriggerHistory,
  employees: IEmployees[] = [],
): RuleRunEntry {
  const employee = employees.find(
    (item) => String(item.id) === history.employee_id,
  );
  return {
    id: history.id,
    triggeredAt: history.created_at,
    triggerType:
      history.trigger_mode === "override"
        ? "OVERRIDE"
        : history.trigger_mode === "manual"
          ? "MANUAL"
          : "HRIS",
    triggerSource: history.trigger_source,
    ruleName: history.rule_name,
    employeeName: employee
      ? employeeName(employee)
      : (history.employee_email ?? history.employee_id),
    employeeEmail: history.employee_email ?? employee?.email ?? null,
    employeeRole: employee?.job_title ?? "Not set",
    employeeCountry: employee?.country ?? "Not set",
    employeeCountryCode: employee?.country_code ?? "",
    outcome: history.outcome
      .toUpperCase()
      .replace("-", "_") as RuleRunEntry["outcome"],
    supersededBy: history.outcome === "superseded" ? history.rule_name : null,
    onboardingRecordId: history.employee_id,
    failurePayload: history.failure_payload,
    contextPayload: history.context_payload,
    notes: getRunDetailNotes({
      failurePayload: history.failure_payload,
    } as RuleRunEntry),
  };
}

export function impactedToSelections(
  impacted: CatalogPolicyImpactedEmployee[],
): EmployeeSelection[] {
  return impacted.map((employee) => ({
    id: employee.id,
    ruleId: "",
    employeeId: employee.id,
    employeeName: employeeName(employee),
    employeeRole: employee.job_title ?? "Not set",
    employeeLevel: employee.level ?? "Not set",
    employeeCountry: employee.country ?? employee.country_id ?? "Not set",
    employeeCountryCode: employee.country_code ?? "",
    items: [],
    totalCost: 0,
    status: "PENDING",
    submittedAt: new Date().toISOString(),
  }));
}

function employeeName(employee: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}) {
  return (
    [employee.first_name, employee.last_name].filter(Boolean).join(" ") ||
    employee.email ||
    "Unknown employee"
  );
}
