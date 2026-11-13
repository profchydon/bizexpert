import assert from "node:assert/strict";
import { test } from "node:test";
import type { IDashboard, IRecentOrders } from "@/types/dashboard";
import {
  dashboardRecentOrders,
  isDashboardRecentOrdersVisible,
  resolveRecentOrderType,
} from "./dashboardRecentOrders";

const order = (overrides: Partial<IRecentOrders> = {}): IRecentOrders => ({
  id: "1",
  order_number: "RE-OFF-58C0E-2026",
  status: "in_progress",
  type: null,
  country: "Afghanistan",
  currency: "£",
  country_code: "AF",
  order_date: "2026-09-01T18:01:18.000000Z",
  ...overrides,
});

const dashboard = (overrides: Partial<IDashboard> = {}): IDashboard =>
  ({
    recent_orders: [],
    panels: { ordering: { frequency: [], recent_orders: [] } },
    ...overrides,
  }) as IDashboard;

test("resolveRecentOrderType prefers an explicit order-flow type", () => {
  assert.equal(
    resolveRecentOrderType(order({ type: "onboarding" })),
    "onboarding",
  );
});

test("resolveRecentOrderType infers type from verified order-number prefixes", () => {
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-OFF-58C0E-2026" })),
    "offboarding",
  );
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-ONB-5757E-2026" })),
    "onboarding",
  );
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-BTF-83EC0-2026" })),
    "onboarding",
  );
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-STE-32B6D-2026" })),
    "storage_to_employee",
  );
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-STO-2DD5C-2026" })),
    "storage_order",
  );
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-DRF-1A2B3-2026" })),
    "device_refresh",
  );
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-BTS-D4199-2026" })),
    "buy_to_storage",
  );
});

test("resolveRecentOrderType leaves unknown prefixes empty", () => {
  assert.equal(
    resolveRecentOrderType(order({ order_number: "RE-XYZ-1-2026" })),
    null,
  );
});

test("dashboardRecentOrders prefers panels.ordering.recent_orders", () => {
  const rows = dashboardRecentOrders(
    dashboard({
      recent_orders: [order({ id: "legacy", order_number: "RE-OFF-LEGACY" })],
      panels: {
        ordering: {
          frequency: [],
          recent_orders: [
            order({ id: "panel", order_number: "RE-ONB-PANEL", type: null }),
          ],
        },
      },
    }),
  );

  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.id, "panel");
  assert.equal(rows[0]?.type, "onboarding");
});

test("dashboardRecentOrders falls back to recent_orders and caps at eight", () => {
  const rows = dashboardRecentOrders(
    dashboard({
      recent_orders: Array.from({ length: 10 }, (_, index) =>
        order({ id: String(index), order_number: `RE-OFF-${index}` }),
      ),
    }),
  );

  assert.equal(rows.length, 8);
  assert.equal(rows[0]?.type, "offboarding");
});

test("recent orders visibility follows access.visibility.ordering", () => {
  assert.equal(isDashboardRecentOrdersVisible(dashboard()), true);
  assert.equal(
    isDashboardRecentOrdersVisible(
      dashboard({ access: { visibility: { ordering: false } } }),
    ),
    false,
  );
});
