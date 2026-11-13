export type RuleStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type SelectionMode = "FIXED" | "OPEN";
export type TriggerType = "MANUAL" | "HRIS" | "OVERRIDE";
export type StorageGrade = "GRADE_A_ONLY" | "GRADE_A_AND_B";
export type ConflictSeverity = "RED" | "AMBER" | "NONE";
export type ImpactType = "new_coverage" | "displacement";
export type RunOutcome =
  | "MATCHED"
  | "SUPERSEDED"
  | "FAILED"
  | "POLICY_UNMATCHED"
  | "RESOLVED";
export type ApproverType = "ADMIN" | "LINE_MANAGER" | "SPECIFIC";
export type SelectionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export interface CatalogRule {
  id: string;
  catalogId?: string;
  backendRuleId?: string;
  name: string;
  purpose: "ONBOARDING";
  matchRoles: string[];
  matchRoleIds?: string[];
  matchLevels: string[];
  matchLevelIds?: string[];
  matchDepartments: string[];
  matchDepartmentIds?: string[];
  matchCountries: string[];
  matchCountryIds?: string[];
  kitIds: string[];
  kits?: CatalogKit[];
  selectionMode: SelectionMode;
  triggerType: TriggerType;
  allowItemSwap: boolean;
  includeCompanyStorage: boolean;
  storageMinGrade: StorageGrade;
  specificityScore: number;
  status: RuleStatus;
  parentRuleId?: string | null;
  budget?: number | null;
  requiresApproval?: boolean;
  approverType?: ApproverType | null;
  approverId?: string | null;
  approverIds?: string[];
  approvers?: CatalogRuleApprover[];
  selectionLimits?: SelectionLimit[];
  selectionLimitsOverride?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogRuleApprover {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface SelectionLimit {
  categoryId?: string;
  category: string;
  min: number;
  max: number | null;
}

export interface CatalogKit {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "DRAFT";
  totalCost: number;
  items: KitItem[];
  itemsCount?: number;
}

export interface KitItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  imageTone: string;
}

export interface MockEmployee {
  id: string;
  name: string;
  role: string;
  level: string;
  department: string;
  country: string;
  countryCode: string;
}

export interface ConflictResult {
  severity: ConflictSeverity;
  currentWins: boolean;
  conflictingRuleId: string;
  conflictingRuleName: string;
  overlapDescription: string;
  affectedEmployees: { id: string; name: string }[];
}

export interface ImpactPreviewRow {
  employeeId: string;
  employeeName: string;
  role: string;
  level: string;
  country: string;
  countryCode: string;
  currentMatchedBy: string | null;
  impact: ImpactType;
  displacedFrom?: string;
}

export interface RuleRunEntry {
  id: string;
  triggeredAt: string;
  triggerType: TriggerType;
  triggerSource?: string | null;
  ruleName?: string | null;
  employeeName: string;
  employeeEmail?: string | null;
  employeeRole: string;
  employeeCountry: string;
  employeeCountryCode: string;
  outcome: RunOutcome;
  supersededBy: string | null;
  onboardingRecordId: string | null;
  notes: string | null;
  failurePayload?: Record<string, unknown> | null;
  contextPayload?: Record<string, unknown> | null;
}

export interface EmployeeSelection {
  id: string;
  ruleId: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  employeeLevel: string;
  employeeCountry: string;
  employeeCountryCode: string;
  items: KitItem[];
  totalCost: number;
  status: SelectionStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  changeRequestNotes?: string | null;
}

export interface RuleFilters {
  roles: string[];
  levels: string[];
  departments: string[];
  countries: string[];
}

export type RuleStatusFilter = "All" | "Draft" | "Active" | "Archived";
export type RuleView = "card" | "table";

export interface RulePagination {
  currentPage: number;
  isLoading?: boolean;
  lastPage: number;
  onPageChange: (page: number) => void;
  total: number;
}
