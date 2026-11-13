import assert from "node:assert/strict";
import { test } from "node:test";
import type { IDashboard } from "@/types/dashboard";
import { dashboardCatalogPolicySummary } from "./dashboardCatalogPolicy";

const dashboard = (overrides: Partial<IDashboard> = {}): IDashboard =>
  ({
    cards: {
      total_employees: 0,
      total_inventory: 0,
      total_active_orders: 0,
      total_active_catalogs: 0,
      total_order_value: 0,
    },
    order_frequency: [],
    equipment_by_country: [],
    equipment_by_category: [],
    recent_orders: [],
    recent_catalogs: [],
    recent_catalog_order_requests: [],
    wallet: {
      wallet: { current_balance: "0", current_limit: "0" },
      wallet_history: {
        daily_snapshot: [],
        weekly_snapshot: [],
        yearly_snapshot: [],
      },
    },
    ...overrides,
  }) as IDashboard;

test("dashboardCatalogPolicySummary reads the dashboard catalog_policy panel", () => {
  const summary = dashboardCatalogPolicySummary(
    dashboard({
      access: { visibility: { catalog_policy: true } },
      panels: {
        catalog_policy: {
          employee_coverage: { covered: 5, total: 65, percent: 8 },
          policy_status: { total: 5, active: 3, draft: 2 },
          kits_assigned: 1,
        },
      },
    }),
  );

  assert.deepEqual(summary, {
    coveredCount: 5,
    employeeCount: 65,
    activeCount: 3,
    inactiveCount: 2,
    kitCount: 1,
    visible: true,
  });
});

test("dashboardCatalogPolicySummary uses zeros when the panel is missing", () => {
  const summary = dashboardCatalogPolicySummary(dashboard());

  assert.deepEqual(summary, {
    coveredCount: 0,
    employeeCount: 0,
    activeCount: 0,
    inactiveCount: 0,
    kitCount: 0,
    visible: true,
  });
});

test("dashboardCatalogPolicySummary hides the card when visibility is false", () => {
  const summary = dashboardCatalogPolicySummary(
    dashboard({
      access: { visibility: { catalog_policy: false } },
    }),
  );

  assert.equal(summary.visible, false);
});
