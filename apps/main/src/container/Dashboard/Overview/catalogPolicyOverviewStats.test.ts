import assert from "node:assert/strict";
import { test } from "node:test";
import type { CatalogPolicyApiPolicy } from "@/types/catalogPolicy";
import {
  policiesApplyingInCountry,
  summarizeCatalogPolicies,
} from "./catalogPolicyOverviewStats";

const policy = (
  overrides: Partial<CatalogPolicyApiPolicy> &
    Pick<CatalogPolicyApiPolicy, "id">,
): CatalogPolicyApiPolicy => ({
  company_id: "co-1",
  created_by: null,
  name: "Policy",
  description: null,
  selection_mode: "fixed",
  approval_type: "manual",
  purpose: null,
  status: "active",
  budget_per_employee: null,
  is_archived: false,
  created_at: "",
  updated_at: "",
  ...overrides,
});

test("summarizeCatalogPolicies counts live active, inactive, and unique kits", () => {
  const summary = summarizeCatalogPolicies([
    policy({
      id: "p1",
      status: "active",
      rules: [
        {
          id: "r1",
          catalog_id: "p1",
          type: "main",
          name: "Main",
          kits: ["kit-a", "kit-b"],
          specificity_score: 1,
          is_active: true,
          created_at: "",
          updated_at: "",
        },
      ],
    }),
    policy({
      id: "p2",
      status: "inactive",
      rules: [
        {
          id: "r2",
          catalog_id: "p2",
          type: "main",
          name: "Main",
          kits: { data: [{ id: "kit-a" }, { id: "kit-c" }] },
          specificity_score: 1,
          is_active: false,
          created_at: "",
          updated_at: "",
        },
      ],
    }),
    policy({ id: "p3", status: "active", is_archived: true }),
  ]);

  assert.deepEqual(summary, {
    activeCount: 1,
    inactiveCount: 1,
    kitCount: 3,
  });
});

test("summarizeCatalogPolicies counts kits from list payloads that only send main_rule", () => {
  const summary = summarizeCatalogPolicies([
    policy({
      id: "p4",
      status: "active",
      main_rule: {
        id: "r-main",
        catalog_id: "p4",
        type: "main",
        name: "Main",
        kits: {
          data: [{ id: "kit-list" }],
        },
        specificity_score: 1,
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    }),
  ]);

  assert.equal(summary.kitCount, 1);
});

test("policiesApplyingInCountry keeps global rules and country matches", () => {
  const globalPolicy = policy({
    id: "global",
    main_rule: {
      id: "r-global",
      catalog_id: "global",
      type: "main",
      name: "Main",
      countries: [],
      specificity_score: 0,
      is_active: true,
      created_at: "",
      updated_at: "",
    },
  });
  const ukPolicy = policy({
    id: "uk",
    main_rule: {
      id: "r-uk",
      catalog_id: "uk",
      type: "main",
      name: "UK",
      countries: [{ id: "gb", name: "United Kingdom" }],
      specificity_score: 3,
      is_active: true,
      created_at: "",
      updated_at: "",
    },
  });
  const ngPolicy = policy({
    id: "ng",
    main_rule: {
      id: "r-ng",
      catalog_id: "ng",
      type: "main",
      name: "NG",
      countries: [{ id: "ng", name: "Nigeria" }],
      specificity_score: 3,
      is_active: true,
      created_at: "",
      updated_at: "",
    },
  });

  assert.deepEqual(
    policiesApplyingInCountry([globalPolicy, ukPolicy, ngPolicy]).map(
      (item) => item.id,
    ),
    ["global", "uk", "ng"],
  );
  assert.deepEqual(
    policiesApplyingInCountry(
      [globalPolicy, ukPolicy, ngPolicy],
      "United Kingdom",
    ).map((item) => item.id),
    ["global", "uk"],
  );
});
