import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  CatalogPolicyApiPolicy,
  CatalogPolicyApiRule,
} from "@/types/catalogPolicy";

import {
  apiRuleToCatalogRule,
  getPolicyChildRules,
  kitToCatalogKit,
  policyToRule,
  ruleToPolicyPayload,
} from "./apiAdapters";
import { ruleToConflictCheckPayload } from "./conflictPayload";

describe("catalog policy API adapters", () => {
  it("uses backend criterion names instead of ids in rule displays", () => {
    const rule = {
      id: "rule-1",
      catalog_id: "policy-1",
      type: "main",
      name: "Main rule",
      job_titles: [
        {
          value: "Engineering Director",
          normalized: "engineering director",
        },
      ],
      levels: [{ id: "level-1", name: "Executive" }],
      departments: [{ id: "dept-1", name: "Engineering" }],
      countries: [{ id: "country-1", name: "Nigeria" }],
      kits: {
        data: [
          {
            id: "kit-1",
            name: "Demo Starter Kit Edited",
            status: "active",
            items_count: 6,
          },
        ],
      },
      allow_item_swap: true,
      include_storage: true,
      storage_policy: { min_grade: "GRADE_A_ONLY", selection_limits: [] },
      selection_mode: "fixed",
      approval_type: "auto",
      budget_per_employee: null,
      specificity_score: 7,
      is_active: true,
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
    } satisfies CatalogPolicyApiRule;

    const policy = {
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Policy",
      description: null,
      selection_mode: "fixed",
      approval_type: "auto",
      purpose: "onboarding",
      status: "active",
      budget_per_employee: "2000.00",
      is_archived: false,
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
    } satisfies CatalogPolicyApiPolicy;

    const catalogRule = apiRuleToCatalogRule(rule, policy);

    assert.deepEqual(catalogRule.matchRoles, ["Engineering Director"]);
    assert.deepEqual(catalogRule.matchRoleIds, ["Engineering Director"]);
    assert.deepEqual(catalogRule.matchLevels, ["Executive"]);
    assert.deepEqual(catalogRule.matchLevelIds, ["level-1"]);
    assert.deepEqual(catalogRule.matchDepartments, ["Engineering"]);
    assert.deepEqual(catalogRule.matchDepartmentIds, ["dept-1"]);
    assert.deepEqual(catalogRule.matchCountries, ["Nigeria"]);
    assert.deepEqual(catalogRule.matchCountryIds, ["country-1"]);
    assert.deepEqual(catalogRule.kitIds, ["kit-1"]);
    assert.equal(catalogRule.kits?.[0]?.name, "Demo Starter Kit Edited");
    assert.equal(catalogRule.kits?.[0]?.itemsCount, 6);

    const payload = ruleToPolicyPayload(catalogRule).rule;
    assert.deepEqual(payload?.levels, ["level-1"]);
    assert.deepEqual(payload?.departments, ["dept-1"]);
    assert.deepEqual(payload?.countries, ["country-1"]);
  });

  it("filters main rules from catalog child rule responses", () => {
    const policy = {
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Policy",
      description: null,
      selection_mode: "fixed",
      approval_type: "auto",
      purpose: "onboarding",
      status: "active",
      budget_per_employee: null,
      is_archived: false,
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
    } satisfies CatalogPolicyApiPolicy;
    const rules = [
      {
        id: "main-rule",
        catalog_id: "policy-1",
        type: "main",
        name: "Main rule",
        roles: [],
        levels: [],
        departments: [],
        countries: [],
        kits: [],
        specificity_score: 0,
        is_active: true,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      },
      {
        id: "sub-rule",
        catalog_id: "policy-1",
        type: "sub",
        name: "Engineering sub rule",
        roles: [],
        levels: [{ id: "level-1", name: "Executive" }],
        departments: [],
        countries: [],
        kits: [],
        specificity_score: 1,
        is_active: true,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      },
    ] satisfies CatalogPolicyApiRule[];

    const childRules = getPolicyChildRules(policy, rules);

    assert.equal(childRules.length, 1);
    assert.equal(childRules[0].id, "sub-rule");
    assert.equal(childRules[0].name, "Engineering sub rule");
    assert.deepEqual(childRules[0].matchLevels, ["Executive"]);
  });

  it("uses main_rule values and sends selection settings inside rule payloads", () => {
    const policy = {
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Open policy",
      description: null,
      selection_mode: "fixed",
      approval_type: "auto",
      purpose: "onboarding",
      status: "active",
      budget_per_employee: null,
      is_archived: false,
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
      main_rule: {
        id: "rule-1",
        catalog_id: "policy-1",
        type: "main",
        name: "Open policy",
        selection_mode: "open",
        approval_type: "manual",
        budget_per_employee: 3000,
        trigger_mode: "external_sync",
        trigger_sources: ["HRIS"],
        roles: [],
        levels: [],
        departments: [],
        countries: [],
        kits: [],
        allow_item_swap: false,
        include_storage: true,
        storage_policy: { min_grade: "GRADE_A_ONLY" },
        specificity_score: 0,
        is_active: true,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      },
    } satisfies CatalogPolicyApiPolicy;

    const rule = policyToRule(policy);
    const payload = ruleToPolicyPayload(rule);

    assert.equal(rule.selectionMode, "OPEN");
    assert.equal(rule.requiresApproval, true);
    assert.equal(rule.budget, 3000);
    assert.equal("selection_mode" in payload, false);
    assert.equal("approval_type" in payload, false);
    assert.equal("budget_per_employee" in payload, false);
    assert.equal(payload.rule?.selection_mode, "open");
    assert.equal(payload.rule?.approval_type, "manual");
    assert.equal(payload.rule?.budget_per_employee, 3000);
    assert.equal("storage_policy" in payload.rule!, false);
  });

  it("adds specific person approver ids to policy payloads", () => {
    const payload = ruleToPolicyPayload(
      {
        ...policyToRule({
          id: "policy-1",
          company_id: "company-1",
          created_by: null,
          name: "Approval policy",
          description: null,
          selection_mode: "fixed",
          approval_type: "manual",
          purpose: "onboarding",
          status: "inactive",
          budget_per_employee: null,
          is_archived: false,
          created_at: "2026-04-30T12:00:00Z",
          updated_at: "2026-04-30T12:00:00Z",
        }),
        requiresApproval: true,
        approverType: "SPECIFIC",
        approverIds: ["employee-1", "employee-2"],
      },
      { currentUserId: "admin-1" },
    );

    assert.deepEqual(payload.approver_ids, ["employee-1", "employee-2"]);
    assert.equal(payload.rule?.approval_type, "manual");
  });

  it("sends only additional people for admin-backed approval", () => {
    const payload = ruleToPolicyPayload(
      {
        ...policyToRule({
          id: "policy-1",
          company_id: "company-1",
          created_by: null,
          name: "Approval policy",
          description: null,
          selection_mode: "fixed",
          approval_type: "manual",
          purpose: "onboarding",
          status: "inactive",
          budget_per_employee: null,
          is_archived: false,
          created_at: "2026-04-30T12:00:00Z",
          updated_at: "2026-04-30T12:00:00Z",
        }),
        requiresApproval: true,
        approverType: "ADMIN",
        approverIds: ["employee-1", "employee-2"],
      },
      { currentUserId: "admin-1" },
    );

    assert.deepEqual(payload.approver_ids, ["employee-1", "employee-2"]);
  });

  it("omits approver ids for line manager approvals", () => {
    const payload = ruleToPolicyPayload({
      ...policyToRule({
        id: "policy-1",
        company_id: "company-1",
        created_by: null,
        name: "Line manager policy",
        description: null,
        selection_mode: "fixed",
        approval_type: "manual",
        purpose: "onboarding",
        status: "inactive",
        budget_per_employee: null,
        is_archived: false,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      }),
      requiresApproval: true,
      approverType: "LINE_MANAGER",
      approverIds: ["employee-1"],
    });

    assert.equal("approver_ids" in payload, false);
  });

  it("clears approver ids with null when switching back to automatic approval", () => {
    const payload = ruleToPolicyPayload({
      ...policyToRule({
        id: "policy-1",
        company_id: "company-1",
        created_by: null,
        name: "Approval policy",
        description: null,
        selection_mode: "fixed",
        approval_type: "manual",
        purpose: "onboarding",
        status: "inactive",
        budget_per_employee: null,
        is_archived: false,
        approver_ids: ["employee-1"],
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      }),
      approverIds: ["employee-1"],
      requiresApproval: false,
    });

    assert.equal(payload.approver_ids, null);
    assert.equal(payload.rule?.approval_type, "auto");
  });

  it("preserves fetched approver ids for manual policy updates", () => {
    const rule = policyToRule({
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Open manual policy",
      description: null,
      selection_mode: "open",
      approval_type: "manual",
      purpose: "onboarding",
      status: "inactive",
      budget_per_employee: 5000,
      is_archived: false,
      approver_ids: ["employee-1", "employee-2"],
      approvers: [
        {
          id: "employee-1",
          first_name: "Catalog",
          last_name: "One",
          email: "catalog1@yopmail.com",
        },
        {
          id: "employee-2",
          first_name: "Joe",
          last_name: "Andy",
          email: "joeandy@yopmail.com",
        },
      ],
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
      main_rule: {
        id: "rule-1",
        catalog_id: "policy-1",
        type: "main",
        name: "Open manual policy",
        trigger_mode: "manual",
        roles: [],
        levels: [],
        departments: [],
        countries: [],
        kits: { data: [] },
        allow_item_swap: true,
        include_storage: false,
        selection_mode: "open",
        approval_type: "manual",
        budget_per_employee: 5000,
        selection_config: {
          categories: [{ category_id: "category-1", min: 0, max: 2 }],
        },
        specificity_score: 0,
        is_active: false,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      },
    });

    const payload = ruleToPolicyPayload({
      ...rule,
      selectionLimits: [
        { categoryId: "category-1", category: "Laptop", min: 0, max: 3 },
      ],
    });

    assert.deepEqual(rule.approverIds, ["employee-1", "employee-2"]);
    assert.deepEqual(rule.approvers, [
      {
        id: "employee-1",
        firstName: "Catalog",
        lastName: "One",
        email: "catalog1@yopmail.com",
      },
      {
        id: "employee-2",
        firstName: "Joe",
        lastName: "Andy",
        email: "joeandy@yopmail.com",
      },
    ]);
    assert.deepEqual(payload.approver_ids, ["employee-1", "employee-2"]);
  });

  it("omits budget per employee for fixed policy payloads", () => {
    const payload = ruleToPolicyPayload({
      ...policyToRule({
        id: "policy-1",
        company_id: "company-1",
        created_by: null,
        name: "Fixed policy",
        description: null,
        selection_mode: "fixed",
        approval_type: "auto",
        purpose: "onboarding",
        status: "inactive",
        budget_per_employee: null,
        is_archived: false,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      }),
      selectionMode: "FIXED",
      budget: 5000,
    });

    assert.equal("budget_per_employee" in payload.rule!, false);
  });

  it("sends selected roles as job titles in policy payloads", () => {
    const payload = ruleToPolicyPayload({
      ...policyToRule({
        id: "policy-1",
        company_id: "company-1",
        created_by: null,
        name: "Role policy",
        description: null,
        selection_mode: "fixed",
        approval_type: "auto",
        purpose: "onboarding",
        status: "inactive",
        budget_per_employee: null,
        is_archived: false,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      }),
      matchRoles: ["Admin", "Manager"],
    });

    assert.equal("roles" in payload.rule!, false);
    assert.deepEqual(payload.rule?.job_titles, ["Admin", "Manager"]);
  });

  it("keeps cleared criteria empty after cached ids are cleared", () => {
    const payload = ruleToPolicyPayload({
      ...policyToRule({
        id: "policy-1",
        company_id: "company-1",
        created_by: null,
        name: "Cleared criteria policy",
        description: null,
        selection_mode: "fixed",
        approval_type: "auto",
        purpose: "onboarding",
        status: "inactive",
        budget_per_employee: null,
        is_archived: false,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      }),
      matchLevels: [],
      matchLevelIds: undefined,
      matchDepartments: [],
      matchDepartmentIds: undefined,
      matchCountries: [],
      matchCountryIds: undefined,
    });

    assert.deepEqual(payload.rule?.levels, []);
    assert.deepEqual(payload.rule?.departments, []);
    assert.deepEqual(payload.rule?.countries, []);
  });

  it("adds fixed category selection config to open policy payloads", () => {
    const payload = ruleToPolicyPayload(
      {
        ...policyToRule({
          id: "policy-1",
          company_id: "company-1",
          created_by: null,
          name: "Open policy",
          description: null,
          selection_mode: "open",
          approval_type: "auto",
          purpose: "onboarding",
          status: "inactive",
          budget_per_employee: null,
          is_archived: false,
          created_at: "2026-04-30T12:00:00Z",
          updated_at: "2026-04-30T12:00:00Z",
        }),
        selectionMode: "OPEN",
      },
      { selectionCategoryIds: ["category-1", "category-2"] },
    );

    assert.deepEqual(payload.rule?.selection_config, {
      categories: [
        { category_id: "category-1", min: 0, max: 1 },
        { category_id: "category-2", min: 0, max: 1 },
      ],
    });
  });

  it("maps backend selection config limits and preserves them in update payloads", () => {
    const rule = policyToRule({
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Open policy",
      description: null,
      selection_mode: "open",
      approval_type: "auto",
      purpose: "onboarding",
      status: "active",
      budget_per_employee: 6000,
      is_archived: false,
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
      main_rule: {
        id: "rule-1",
        catalog_id: "policy-1",
        type: "main",
        name: "Open policy",
        selection_config: {
          categories: [{ category_id: "category-1", min: 0, max: 2 }],
        },
        specificity_score: 1,
        is_active: true,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      } as CatalogPolicyApiRule,
    });

    assert.deepEqual(rule.selectionLimits, [
      { categoryId: "category-1", category: "category-1", min: 0, max: 2 },
    ]);
    assert.deepEqual(ruleToPolicyPayload(rule).rule?.selection_config, {
      categories: [{ category_id: "category-1", min: 0, max: 2 }],
    });
  });

  it("uses freshly fetched kit categories for kit configuration updates", () => {
    const rule = {
      ...policyToRule({
        id: "policy-1",
        company_id: "company-1",
        created_by: null,
        name: "Open policy",
        description: null,
        selection_mode: "open",
        approval_type: "auto",
        purpose: "onboarding",
        status: "active",
        budget_per_employee: 6000,
        is_archived: false,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      }),
      selectionLimits: [
        { categoryId: "stale-category", category: "Stale", min: 0, max: 2 },
        { categoryId: "category-2", category: "Display", min: 1, max: 3 },
      ],
    };

    const payload = ruleToPolicyPayload(rule, {
      selectionCategoryIds: ["category-1", "category-2"],
    });

    assert.deepEqual(payload.rule?.selection_config, {
      categories: [
        { category_id: "category-1", min: 0, max: 1 },
        { category_id: "category-2", min: 1, max: 3 },
      ],
    });
  });

  it("can force rule active for create payloads regardless of policy type", () => {
    const basePolicy = {
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Draft policy",
      description: null,
      selection_mode: "fixed",
      approval_type: "auto",
      purpose: "onboarding",
      status: "inactive",
      budget_per_employee: null,
      is_archived: false,
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
    } satisfies CatalogPolicyApiPolicy;
    const fixedPayload = ruleToPolicyPayload(policyToRule(basePolicy), {
      forceRuleActive: true,
    });
    const openPayload = ruleToPolicyPayload(
      { ...policyToRule(basePolicy), selectionMode: "OPEN" },
      { forceRuleActive: true },
    );

    assert.equal(fixedPayload.rule?.is_active, true);
    assert.equal(openPayload.rule?.is_active, true);
  });

  it("sets acknowledgement flags for create policy displacement conflicts", () => {
    const rule = policyToRule({
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Conflict policy",
      description: null,
      selection_mode: "fixed",
      approval_type: "auto",
      purpose: "onboarding",
      status: "inactive",
      budget_per_employee: null,
      is_archived: false,
      created_at: "2026-04-30T12:00:00Z",
      updated_at: "2026-04-30T12:00:00Z",
    });

    assert.equal(
      ruleToPolicyPayload(rule, { acknowledgeDisplacement: false }).rule
        ?.acknowledge_displacement,
      false,
    );
    assert.equal(
      ruleToPolicyPayload(rule, { acknowledgeDisplacement: true }).rule
        ?.acknowledge_displacement,
      true,
    );
  });

  it("only sends criteria arrays for conflict checks", () => {
    const payload = ruleToConflictCheckPayload({
      ...policyToRule({
        id: "policy-1",
        company_id: "company-1",
        created_by: null,
        name: "Candidate policy",
        description: null,
        selection_mode: "fixed",
        approval_type: "auto",
        purpose: "onboarding",
        status: "inactive",
        budget_per_employee: null,
        is_archived: false,
        created_at: "2026-04-30T12:00:00Z",
        updated_at: "2026-04-30T12:00:00Z",
      }),
      matchLevels: ["level-1"],
      matchDepartments: ["department-1"],
      matchCountries: ["country-1"],
    });

    assert.deepEqual(payload, {
      levels: ["level-1"],
      departments: ["department-1"],
      countries: ["country-1"],
    });
  });

  it("uses items_count from active kit list responses", () => {
    const kit = kitToCatalogKit({
      id: "kit-1",
      name: "Demo Starter Kit Edited",
      status: "active",
      is_archived: false,
      fulfillment_mode: "split",
      items_count: 6,
      items_summary: [],
      updated_at: "2026-04-23T15:53:38.000000Z",
    });

    assert.equal(kit.name, "Demo Starter Kit Edited");
    assert.equal(kit.itemsCount, 6);
    assert.equal(kit.items.length, 0);
  });
});
