import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getRunHistory, getSelectionsForRule } from "./data";
import { baseRule } from "./catalog-policy.test-fixtures";
import {
  getSelectionLimitProductCountFallbacks,
  resolveSelectionLimitCategories,
} from "./selectionLimitAdapters";
import { jobTitlesToOptions } from "@/utils/jobTitleOptions";
import { ruleToCreateSubRulePayload } from "./subRulePayload";
import {
  formatCatalogApproverLabel,
  getCatalogApproverHref,
} from "./utilsApprovers";
import {
  catalogPolicyPageSize,
  catalogPolicyListParams,
  getPaginationControls,
} from "./utilsPagination";
import {
  calculateSpecificityScore,
  childRuleToDraft,
  composeChildRule,
  canConfigureSelectionLimits,
  createChildRuleDraft,
  defaultRuleFilters,
  filterRunHistoryEntries,
  formatRunHistoryTime,
  formatRunOutcome,
  formatSelectionSubmitted,
  formatSelectionSubmittedFull,
  getChildRuleOverrideLabels,
  getEmployeeSelectionGroups,
  getSelectionLimitLabels,
  getSelectionLimitProductCounts,
  isChildRuleDraftValid,
  scopeSelectionLimitsToParent,
  shouldShowActivatePolicyAction,
  summarizeChildRule,
} from "./utils";
import { formatApprovalType } from "./utilsFormat";
import {
  formatConflictEmployeeName,
  getConflictPolicyName,
  getConflictSignature,
  requiresConflictAcknowledgement,
} from "./utilsConflicts";
import {
  canContinuePolicyWizard,
  getPolicyWizardHint,
} from "./components/wizard/wizardValidation";

describe("catalog policy selection and history logic", () => {
  it("formats approval type labels for detail configuration", () => {
    assert.equal(
      formatApprovalType({ requiresApproval: true }),
      "Require approval",
    );
    assert.equal(
      formatApprovalType({ requiresApproval: false }),
      "Approve automatically",
    );
  });

  it("hides activate policy actions for active policies", () => {
    assert.equal(
      shouldShowActivatePolicyAction({ ...baseRule, status: "ACTIVE" }),
      false,
    );
    assert.equal(
      shouldShowActivatePolicyAction({ ...baseRule, status: "DRAFT" }),
      true,
    );
  });

  it("formats approver rows and employee detail links", () => {
    assert.equal(
      formatCatalogApproverLabel({
        id: "employee-1",
        firstName: "Catalog",
        lastName: "One",
        email: "catalog1@yopmail.com",
      }),
      "Catalog One · catalog1@yopmail.com",
    );
    assert.equal(
      getCatalogApproverHref("a10e3c8c-10c6-4618-b931-852938dd3716"),
      "/dashboard/employees/a10e3c8c-10c6-4618-b931-852938dd3716",
    );
  });

  it("summarizes conflict responses for policy creation gating", () => {
    const conflicts = [
      {
        type: "amber" as const,
        rule_id: "rule-1",
        rule_name: "Design Team",
        policy_id: "policy-1",
        policy_name: "Design Team - Global",
        specificity_score: 4,
        employees_count: 2,
        sample_employees: [
          {
            id: "employee-1",
            first_name: "Emeka",
            last_name: "Nwosu",
            email: "emeka@example.com",
          },
        ],
      },
    ];

    assert.equal(requiresConflictAcknowledgement({ conflicts }), true);
    assert.equal(getConflictPolicyName(conflicts[0]), "Design Team - Global");
    assert.equal(
      formatConflictEmployeeName(conflicts[0].sample_employees![0]),
      "Emeka Nwosu",
    );
    assert.match(getConflictSignature(conflicts), /rule-1/);
  });

  it("treats red non-acknowledgeable create policy conflicts as blocking", () => {
    const conflicts = [
      {
        type: "red" as const,
        rule_id: "rule-1",
        rule_name: "Open",
        policy_id: "policy-1",
        policy_name: "Open",
        same_policy: false,
        specificity_score: 7,
        message: "This rule conflicts with Open.",
      },
    ];

    assert.equal(
      requiresConflictAcknowledgement({
        conflicts,
        requiresAcknowledgment: false,
      }),
      false,
    );
    assert.equal(
      getPolicyWizardHint({
        baseCanProceed: true,
        draft: { ...baseRule, kitIds: ["kit-1"], requiresApproval: false },
        hasRequiredApprovers: true,
        isConflictBlocked: true,
        isCheckingConflicts: false,
        requiresConflictAcknowledgment: false,
        step: 3,
      }),
      "Resolve the conflicting policy before creating this policy.",
    );
  });

  it("requires a budget before creating open catalog policies", () => {
    const draft = {
      ...baseRule,
      budget: null,
      kitIds: ["kit-1"],
      requiresApproval: false,
      selectionMode: "OPEN" as const,
    };

    assert.equal(
      canContinuePolicyWizard({
        draft,
        hasRequiredApprovers: true,
        step: 3,
      }),
      false,
    );
    assert.equal(
      getPolicyWizardHint({
        baseCanProceed: false,
        draft,
        hasRequiredApprovers: true,
        isConflictBlocked: false,
        isCheckingConflicts: false,
        step: 3,
      }),
      "Enter a budget per employee before creating an open policy.",
    );
    assert.equal(
      canContinuePolicyWizard({
        draft: { ...draft, budget: 1000 },
        hasRequiredApprovers: true,
        step: 3,
      }),
      true,
    );
  });

  it("does not require additional persons for manual approval", () => {
    assert.equal(
      canContinuePolicyWizard({
        draft: {
          ...baseRule,
          approverIds: [],
          kitIds: ["kit-1"],
          requiresApproval: true,
        },
        hasRequiredApprovers: true,
        step: 3,
      }),
      true,
    );
  });

  it("counts role criteria in the policy specificity score", () => {
    assert.equal(
      calculateSpecificityScore({ ...baseRule, matchRoles: ["Engineer"] }),
      calculateSpecificityScore({ ...baseRule, matchRoles: [] }) + 2,
    );
  });

  it("maps job title responses into role options when shape is available", () => {
    assert.deepEqual(
      jobTitlesToOptions({
        data: ["Support", "QA ENgineer"],
      }),
      [
        { value: "Support", label: "Support" },
        { value: "QA ENgineer", label: "QA ENgineer" },
      ],
    );
  });

  it("enables sub-rule pagination controls from endpoint metadata", () => {
    assert.deepEqual(getPaginationControls({ currentPage: 1, lastPage: 3 }), {
      canGoNext: true,
      canGoPrevious: false,
    });
    assert.deepEqual(
      getPaginationControls({ currentPage: 3, lastPage: 3, isLoading: true }),
      { canGoNext: false, canGoPrevious: false },
    );
  });

  it("requests catalog policies in pages of twenty", () => {
    assert.equal(catalogPolicyPageSize, 20);
  });

  it("builds catalog policy list params from search and filters", () => {
    assert.deepEqual(
      catalogPolicyListParams({
        filters: {
          countries: ["country-1"],
          departments: ["dept-1", "dept-2"],
          levels: ["level-1"],
          roles: [],
        },
        page: 2,
        search: "  engineering ",
        statusFilter: "Active",
      }),
      {
        country_id: "country-1",
        department_id: "dept-1,dept-2",
        is_archived: false,
        level_id: "level-1",
        page: 2,
        per_page: 20,
        search: "engineering",
        status: "active",
      },
    );
  });

  it("maps archived and all catalog policy tabs to documented params", () => {
    assert.deepEqual(
      catalogPolicyListParams({
        filters: defaultRuleFilters,
        page: 1,
        search: "",
        statusFilter: "Archived",
      }),
      { is_archived: true, page: 1, per_page: 20 },
    );
    assert.deepEqual(
      catalogPolicyListParams({
        filters: defaultRuleFilters,
        page: 1,
        search: "",
        statusFilter: "All",
      }),
      { page: 1, per_page: 20 },
    );
  });

  it("only allows selection limit configuration for open catalog policies", () => {
    assert.equal(canConfigureSelectionLimits({ selectionMode: "OPEN" }), true);
    assert.equal(
      canConfigureSelectionLimits({ selectionMode: "FIXED" }),
      false,
    );
  });

  it("formats open catalog selection limits from selected kit categories", () => {
    assert.deepEqual(
      getSelectionLimitLabels({
        selectionMode: "OPEN",
        kitIds: ["kit-1", "kit-2"],
      }),
      [
        "Audio / Visual · 0–1",
        "Display · 0–1",
        "Input Device · 0–1",
        "Laptop · 0–1",
      ],
    );

    assert.deepEqual(
      getSelectionLimitLabels({
        selectionMode: "FIXED",
        kitIds: ["kit-1", "kit-2"],
      }),
      [],
    );
  });

  it("formats saved no-limit selection limits and counts products by category", () => {
    assert.deepEqual(
      getSelectionLimitLabels({
        selectionMode: "OPEN",
        kitIds: ["kit-1", "kit-2"],
        selectionLimits: [{ category: "Laptop", min: 0, max: null }],
      }),
      ["Laptop · 0–No limit"],
    );

    const counts = getSelectionLimitProductCounts({
      kitIds: ["kit-1", "kit-2"],
    });

    assert.equal(counts.get("Laptop"), 2);
    assert.equal(counts.get("Display"), 2);
    assert.equal(counts.get("Input Device"), 2);
    assert.equal(counts.get("Audio / Visual"), 1);
  });

  it("resolves selection limit category names from asset categories", () => {
    const limits = resolveSelectionLimitCategories({
      categories: [
        {
          id: "category-1",
          name: "Laptop",
          status: "active",
          created_at: "",
          updated_at: "",
          deleted_at: null,
        },
      ],
      limits: [
        { categoryId: "category-1", category: "category-1", min: 1, max: 2 },
      ],
    });
    const counts = getSelectionLimitProductCountFallbacks(limits);

    assert.deepEqual(limits, [
      { categoryId: "category-1", category: "Laptop", min: 1, max: 2 },
    ]);
    assert.equal(counts.get("category-1"), 2);
  });

  it("composes child rules from the modal draft overrides", () => {
    const emptyDraft = createChildRuleDraft("child-1", baseRule);
    assert.equal(isChildRuleDraftValid(emptyDraft), false);

    const draft = {
      ...emptyDraft,
      name: "Engineering HRIS",
      kitIds: ["kit-2"],
      narrowRoles: ["Engineer"],
      overrideTrigger: true,
      triggerType: "HRIS" as const,
    };

    assert.equal(isChildRuleDraftValid(draft), true);

    const child = composeChildRule(baseRule, draft, "2026-04-02T00:00:00Z");
    assert.equal(child.parentRuleId, baseRule.id);
    assert.equal(child.status, "DRAFT");
    assert.deepEqual(child.kitIds, ["kit-2"]);
    assert.deepEqual(child.matchRoles, ["Engineer"]);
    assert.equal(child.triggerType, "HRIS");
    assert.equal(child.name, "Engineering HRIS");
    assert.equal(ruleToCreateSubRulePayload(child).name, "Engineering HRIS");
  });

  it("does not inherit the parent backend rule id for new sub policies", () => {
    const child = composeChildRule(
      { ...baseRule, backendRuleId: "main-backend-rule" },
      {
        ...createChildRuleDraft("child-new", baseRule),
        name: "New sub policy",
        kitIds: ["kit-2"],
      },
      "2026-04-02T00:00:00Z",
    );

    assert.equal(child.backendRuleId, undefined);
  });

  it("seeds add sub policy category limits from the parent policy", () => {
    const draft = createChildRuleDraft("child-with-limits", {
      ...baseRule,
      selectionLimits: [
        { categoryId: "category-1", category: "Display", min: 0, max: 15 },
      ],
    });

    assert.deepEqual(draft.categoryLimits, [
      { categoryId: "category-1", category: "Display", min: 0, max: 15 },
    ]);
  });

  it("scopes sub policy category limits to the parent policy limits", () => {
    const parentLimits = [
      { categoryId: "category-1", category: "Imac", min: 0, max: 14 },
      { categoryId: "category-2", category: "Laptop", min: 0, max: 1 },
      { categoryId: "category-3", category: "Phone", min: 0, max: null },
    ];

    assert.deepEqual(
      scopeSelectionLimitsToParent(
        [
          { categoryId: "category-1", category: "Imac", min: 20, max: 20 },
          { categoryId: "category-2", category: "Laptop", min: 2, max: null },
          { categoryId: "category-3", category: "Phone", min: 0, max: null },
        ],
        parentLimits,
      ),
      [
        { categoryId: "category-1", category: "Imac", min: 0, max: 14 },
        { categoryId: "category-2", category: "Laptop", min: 0, max: 1 },
        { categoryId: "category-3", category: "Phone", min: 0, max: null },
      ],
    );
  });

  it("allows rule changes without narrowed match criteria", () => {
    const draft = {
      ...createChildRuleDraft("child-criteria-free", baseRule),
      name: "Storage override",
      overrideKit: false,
      overrideStorage: true,
      kitIds: ["kit-1"],
      narrowRoles: [],
      narrowLevels: [],
      narrowDepartments: [],
      narrowCountries: [],
    };

    assert.equal(isChildRuleDraftValid(draft), true);
  });

  it("omits active flags from created sub rule payloads", () => {
    const payload = ruleToCreateSubRulePayload({
      ...baseRule,
      status: "DRAFT",
    });

    assert.equal("is_active" in payload, false);
  });

  it("uses the dedicated add sub policy payload structure", () => {
    const payload = ruleToCreateSubRulePayload({
      ...baseRule,
      name: "Test2211 open - Auto-approve under 200k",
      selectionMode: "OPEN",
      triggerType: "HRIS",
      budget: 200000,
      status: "DRAFT",
      matchRoleIds: [],
      matchLevelIds: ["level-1"],
      matchDepartmentIds: ["department-1"],
      matchCountryIds: ["country-1"],
      kitIds: ["kit-2"],
      selectionLimitsOverride: true,
      selectionLimits: [
        { categoryId: "category-1", category: "Display", min: 1, max: 1 },
        { categoryId: "category-2", category: "Laptop", min: 1, max: 1 },
      ],
    });

    assert.deepEqual(payload, {
      type: "sub",
      name: "Test2211 open - Auto-approve under 200k",
      approval_type: "auto",
      budget_per_employee: 200000,
      external_sync_tools: ["HRIS"],
      job_titles: [],
      levels: ["level-1"],
      departments: ["department-1"],
      countries: ["country-1"],
      kits: ["kit-2"],
      allow_item_swap: true,
      include_storage: true,
      storage_policy: null,
      selection_config: {
        categories: [
          { category_id: "category-1", min: 1, max: 1 },
          { category_id: "category-2", min: 1, max: 1 },
        ],
      },
      acknowledge_displacement: false,
    });
  });

  it("sets acknowledgement flags for acknowledged sub policy conflicts", () => {
    const payload = ruleToCreateSubRulePayload(
      {
        ...baseRule,
        status: "DRAFT",
      },
      { acknowledgeDisplacement: true },
    );

    assert.equal(payload.acknowledge_displacement, true);
  });

  it("preserves the parent open selection mode for composed sub policies", () => {
    const draft = {
      ...createChildRuleDraft("child-open", {
        ...baseRule,
        selectionMode: "OPEN",
      }),
      kitIds: ["kit-2"],
      overrideCategoryLimits: true,
      categoryLimits: [
        { categoryId: "category-1", category: "Display", min: 0, max: 2 },
      ],
    };
    const child = composeChildRule(
      { ...baseRule, selectionMode: "OPEN" },
      draft,
      "2026-04-02T00:00:00Z",
    );

    assert.equal(child.selectionMode, "OPEN");
    assert.deepEqual(ruleToCreateSubRulePayload(child).selection_config, {
      categories: [{ category_id: "category-1", min: 0, max: 2 }],
    });
  });

  it("sends scoped sub policy category limits in create payloads", () => {
    const child = composeChildRule(
      {
        ...baseRule,
        selectionMode: "OPEN",
        selectionLimits: [
          { categoryId: "category-1", category: "Imac", min: 0, max: 14 },
        ],
      },
      {
        ...createChildRuleDraft("child-scoped", baseRule),
        name: "Scoped child",
        kitIds: ["kit-2"],
        overrideCategoryLimits: true,
        categoryLimits: [
          { categoryId: "category-1", category: "Imac", min: 20, max: 20 },
        ],
      },
      "2026-04-02T00:00:00Z",
    );

    assert.deepEqual(ruleToCreateSubRulePayload(child).selection_config, {
      categories: [{ category_id: "category-1", min: 0, max: 14 }],
    });
  });

  it("sets sub policy selection config to null for fixed catalog policies", () => {
    const payload = ruleToCreateSubRulePayload({
      ...baseRule,
      selectionMode: "FIXED",
      selectionLimitsOverride: true,
      selectionLimits: [
        { categoryId: "category-1", category: "Display", min: 0, max: 2 },
      ],
      status: "DRAFT",
    });

    assert.equal(payload.selection_config, null);
  });

  it("derives sub policy sync tools from the HRIS trigger toggle", () => {
    const payload = ruleToCreateSubRulePayload({
      ...baseRule,
      triggerType: "HRIS",
      status: "DRAFT",
    });

    assert.equal("trigger_mode" in payload, false);
    assert.deepEqual(payload.external_sync_tools, ["HRIS"]);
  });

  it("derives editable child rule drafts and compact card summaries", () => {
    const child = {
      ...baseRule,
      id: "child-2",
      name: "Sales Team - Global",
      parentRuleId: baseRule.id,
      matchRoles: ["Sales"],
      matchLevels: ["L1", "L2"],
      matchLevelIds: ["level-1", "level-2"],
      matchDepartments: ["Engineering", "Product"],
      matchDepartmentIds: ["dept-1", "dept-2"],
      matchCountries: ["Kenya", "United Kingdom", "Nigeria"],
      matchCountryIds: ["country-1", "country-2", "country-3"],
      kitIds: ["kit-2"],
      includeCompanyStorage: false,
    };

    const draft = childRuleToDraft(child, baseRule);
    assert.equal(draft.overrideKit, true);
    assert.equal(draft.overrideStorage, true);
    assert.deepEqual(getChildRuleOverrideLabels(child, baseRule), [
      "Kits override",
      "Storage override",
    ]);
    assert.deepEqual(draft.narrowRoles, ["Sales"]);
    assert.deepEqual(draft.narrowLevels, ["L1", "L2"]);
    assert.deepEqual(draft.narrowLevelIds, ["level-1", "level-2"]);
    assert.deepEqual(draft.narrowDepartmentIds, ["dept-1", "dept-2"]);
    assert.deepEqual(draft.narrowCountryIds, [
      "country-1",
      "country-2",
      "country-3",
    ]);
    assert.equal(
      summarizeChildRule(child),
      "Sales · L1, L2 · Engineering, Product · Kenya, United Kingdom, Nigeria",
    );
  });

  it("prepopulates editable child drafts even when criteria match the parent", () => {
    const parent = {
      ...baseRule,
      matchLevels: ["Executive"],
      matchLevelIds: ["level-1"],
      matchDepartments: ["Engineering"],
      matchDepartmentIds: ["dept-1"],
      matchCountries: ["Nigeria"],
      matchCountryIds: ["country-1"],
      kitIds: ["kit-1"],
    };
    const draft = childRuleToDraft(
      {
        ...parent,
        id: "child-same-scope",
        name: "Existing sub policy",
        parentRuleId: parent.id,
      },
      parent,
    );

    assert.deepEqual(draft.narrowLevels, ["Executive"]);
    assert.deepEqual(draft.narrowLevelIds, ["level-1"]);
    assert.deepEqual(draft.narrowDepartments, ["Engineering"]);
    assert.deepEqual(draft.narrowDepartmentIds, ["dept-1"]);
    assert.deepEqual(draft.narrowCountries, ["Nigeria"]);
    assert.deepEqual(draft.narrowCountryIds, ["country-1"]);
    assert.equal(draft.overrideKit, true);
  });

  it("groups open employee selections for review tabs", () => {
    const selections = [
      makeSelection("sel-a", "Kemi Ojo", "PENDING"),
      makeSelection("sel-b", "Oliver Brown", "APPROVED"),
    ];

    const grouped = getEmployeeSelectionGroups(selections, "kemi");
    assert.equal(grouped.searched.length, 1);
    assert.equal(grouped.inReview.length, 1);
    assert.equal(grouped.approved.length, 0);
    assert.match(formatSelectionSubmitted("2026-04-21T10:14:00Z"), /21 Apr ·/);
    assert.match(
      formatSelectionSubmittedFull("2026-04-21T10:14:00Z"),
      /21 Apr 2026 ·/,
    );
  });

  it("seeds the open sales rule with all review statuses", () => {
    const grouped = getEmployeeSelectionGroups(
      getSelectionsForRule("rule-5"),
      "",
    );

    assert.equal(grouped.inReview.length, 3);
    assert.equal(grouped.approved.length, 1);
    assert.ok(
      grouped.inReview.some(
        (selection) => selection.status === "CHANGES_REQUESTED",
      ),
    );
  });

  it("formats and filters fixed-rule run history rows", () => {
    const history = getRunHistory("rule-3");
    assert.equal(history.length, 9);
    assert.equal(formatRunOutcome("POLICY_UNMATCHED"), "Policy Unmatched");
    assert.match(formatRunHistoryTime("2026-04-10T14:32:00Z"), /10 Apr/);

    const failedRows = filterRunHistoryEntries({
      entries: history,
      search: "olivia",
      outcome: "FAILED",
    });
    assert.deepEqual(
      failedRows.map((entry) => entry.employeeName),
      ["Olivia Bennett"],
    );
  });
});

function makeSelection(
  id: string,
  employeeName: string,
  status: "PENDING" | "APPROVED",
) {
  return {
    id,
    ruleId: "rule-a",
    employeeId: id.replace("sel", "emp"),
    employeeName,
    employeeRole: "Sales",
    employeeLevel: "L3",
    employeeCountry: "Nigeria",
    employeeCountryCode: "NG",
    items: [],
    totalCost: 0,
    status,
    submittedAt: "2026-04-21T10:14:00Z",
  };
}
