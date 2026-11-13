import { getCatalogRule } from "./dataStore";
import type { RuleRunEntry } from "./types";

const runRows: RuleRunEntry[] = [
  {
    id: "run-1",
    triggeredAt: "2026-04-10T14:32:00Z",
    triggerType: "MANUAL",
    employeeName: "Tunde Okafor",
    employeeRole: "Engineer",
    employeeCountry: "Nigeria",
    employeeCountryCode: "NG",
    outcome: "MATCHED",
    supersededBy: null,
    onboardingRecordId: "rec-1",
    notes: null,
  },
  {
    id: "run-2",
    triggeredAt: "2026-04-10T14:32:00Z",
    triggerType: "MANUAL",
    employeeName: "Bayo Adeyemi",
    employeeRole: "Engineer",
    employeeCountry: "Nigeria",
    employeeCountryCode: "NG",
    outcome: "MATCHED",
    supersededBy: null,
    onboardingRecordId: "rec-2",
    notes: null,
  },
  {
    id: "run-3",
    triggeredAt: "2026-04-11T09:15:00Z",
    triggerType: "MANUAL",
    employeeName: "Sarah Thompson",
    employeeRole: "Engineer",
    employeeCountry: "United Kingdom",
    employeeCountryCode: "GB",
    outcome: "SUPERSEDED",
    supersededBy: "Senior Engineers - Nigeria",
    onboardingRecordId: "rec-3",
    notes: null,
  },
  {
    id: "run-4",
    triggeredAt: "2026-04-11T09:15:00Z",
    triggerType: "MANUAL",
    employeeName: "David Clarke",
    employeeRole: "Engineer",
    employeeCountry: "United Kingdom",
    employeeCountryCode: "GB",
    outcome: "MATCHED",
    supersededBy: null,
    onboardingRecordId: "rec-4",
    notes: null,
  },
  {
    id: "run-5",
    triggeredAt: "2026-04-12T11:00:00Z",
    triggerType: "HRIS",
    employeeName: "Emeka Nwosu",
    employeeRole: "Designer",
    employeeCountry: "Nigeria",
    employeeCountryCode: "NG",
    outcome: "MATCHED",
    supersededBy: null,
    onboardingRecordId: "rec-5",
    notes: null,
  },
  {
    id: "run-6",
    triggeredAt: "2026-04-13T08:45:00Z",
    triggerType: "MANUAL",
    employeeName: "Emily Watson",
    employeeRole: "Designer",
    employeeCountry: "United Kingdom",
    employeeCountryCode: "GB",
    outcome: "MATCHED",
    supersededBy: null,
    onboardingRecordId: "rec-6",
    notes: null,
  },
  {
    id: "run-7",
    triggeredAt: "2026-04-14T10:20:00Z",
    triggerType: "MANUAL",
    employeeName: "Chidi Okonkwo",
    employeeRole: "Engineer",
    employeeCountry: "Nigeria",
    employeeCountryCode: "NG",
    outcome: "FAILED",
    supersededBy: null,
    onboardingRecordId: null,
    notes: "Kit 'Engineering Starter Kit' could not be found.",
  },
  {
    id: "run-8",
    triggeredAt: "2026-04-14T13:05:00Z",
    triggerType: "MANUAL",
    employeeName: "Olivia Bennett",
    employeeRole: "Designer",
    employeeCountry: "United Kingdom",
    employeeCountryCode: "GB",
    outcome: "FAILED",
    supersededBy: null,
    onboardingRecordId: null,
    notes: "Employee profile is missing a delivery country.",
  },
  {
    id: "run-9",
    triggeredAt: "2026-04-15T08:30:00Z",
    triggerType: "HRIS",
    employeeName: "Noah Williams",
    employeeRole: "Engineer",
    employeeCountry: "United Kingdom",
    employeeCountryCode: "GB",
    outcome: "MATCHED",
    supersededBy: null,
    onboardingRecordId: "rec-9",
    notes: null,
  },
];

export function getRunHistory(ruleId: string) {
  const rule = getCatalogRule(ruleId);
  if (!rule) return [];
  const createdAt = new Date(rule.createdAt).getTime();
  return runRows.filter((entry) => {
    if (new Date(entry.triggeredAt).getTime() < createdAt) return false;
    return (
      rule.matchRoles.length === 0 || entry.employeeRole === rule.matchRoles[0]
    );
  });
}
