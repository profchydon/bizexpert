import assert from "node:assert/strict";
import { test } from "node:test";
import type { IDashboard } from "@/types/dashboard";
import { dashboardOverviewCards } from "./dashboardOverviewCards";

test("dashboardOverviewCards prefers panels.overview over cards", () => {
  const dashboard = {
    cards: {
      total_employees: 37,
      total_inventory: 304,
      total_active_orders: 207,
      total_active_catalogs: 3,
      total_order_value: 1409411.69,
    },
    panels: {
      overview: {
        total_employees: 65,
        total_inventory: 326,
        total_active_orders: 177,
        total_active_catalogs: 3,
        total_order_value: 1421674.15,
      },
    },
  } as IDashboard;

  assert.deepEqual(dashboardOverviewCards(dashboard), {
    total_employees: 65,
    total_inventory: 326,
    total_active_orders: 177,
    total_active_catalogs: 3,
    total_order_value: 1421674.15,
  });
});

test("empty entity panels.overview still drive inventory for setup", () => {
  const dashboard = {
    cards: {
      total_employees: 1,
      total_inventory: 4,
      total_active_orders: 0,
      total_active_catalogs: 0,
      total_order_value: 0,
    },
    panels: {
      overview: {
        total_employees: 1,
        total_inventory: 0,
        total_active_orders: 0,
        total_active_catalogs: 0,
        total_order_value: 0,
      },
    },
  } as IDashboard;

  assert.equal(dashboardOverviewCards(dashboard).total_inventory, 0);
});

test("dashboardOverviewCards falls back to cards", () => {
  const dashboard = {
    cards: {
      total_employees: 37,
      total_inventory: 304,
      total_active_orders: 207,
      total_active_catalogs: 3,
      total_order_value: 1409411.69,
    },
  } as IDashboard;

  assert.equal(dashboardOverviewCards(dashboard).total_employees, 37);
});
