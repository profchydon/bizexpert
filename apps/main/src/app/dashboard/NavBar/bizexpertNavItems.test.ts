import { test } from "node:test";
import assert from "node:assert";
import { Warehouse } from "lucide-react";
import { bizexpertNavIcon, bizexpertNavIconIds } from "./bizexpertNavIcons";
import { bizexpertNavItems } from "./bizexpertNavItems";

function navIds(): string[] {
  return bizexpertNavItems("/dashboard").flatMap((item) => [
    item.id,
    ...(item.children?.map((child) => child.id) ?? []),
  ]);
}

test("inventory is a parent with stores categories products and stock", () => {
  const items = bizexpertNavItems("/dashboard/products");
  const inventory = items.find((item) => item.id === "inventory");
  assert.equal(inventory?.isActive, true);
  assert.deepEqual(
    inventory?.children?.map((child) => child.name),
    [
      "Stores",
      "Categories",
      "Products",
      "Stock",
      "Track item",
      "Stock removals",
    ],
  );
  assert.equal(
    items.some((item) => item.id === "products"),
    false,
  );
});

test("stores submenu stays active on locations routes", () => {
  const items = bizexpertNavItems("/dashboard/locations");
  const inventory = items.find((item) => item.id === "inventory");
  assert.equal(inventory?.isActive, true);
});

test("integrations nav is active on integration routes", () => {
  const items = bizexpertNavItems("/dashboard/integrations/jumia");
  const integrations = items.find((item) => item.id === "integrations");
  assert.equal(integrations?.isActive, true);
});

test("payments nav is active on payment routes", () => {
  const items = bizexpertNavItems("/dashboard/payments/cashflow");
  const payments = items.find((item) => item.id === "payments");
  assert.equal(payments?.isActive, true);
  assert.deepEqual(
    payments?.children?.map((child) => child.name),
    ["Payments", "Transactions", "Cashflow", "Customer analytics"],
  );
});

test("settings nav is active on manage-roles", () => {
  const items = bizexpertNavItems("/dashboard/settings/users/manage-roles");
  const settings = items.find((item) => item.id === "settings");
  assert.equal(settings?.isActive, true);
});

test("customers nav is active on customer routes", () => {
  const items = bizexpertNavItems("/dashboard/customers/abc");
  const customers = items.find((item) => item.id === "customers");
  assert.equal(customers?.isActive, true);
});

test("stock submenu stays active on stocktake routes", () => {
  const items = bizexpertNavItems("/dashboard/inventory/stocktake/abc");
  const inventory = items.find((item) => item.id === "inventory");
  assert.equal(inventory?.isActive, true);
});

test("every BizExpert nav item has an icon", () => {
  const ids = new Set(bizexpertNavIconIds());
  for (const id of navIds()) {
    assert.equal(ids.has(id), true, id);
  }
  assert.equal(bizexpertNavIcon("stock"), Warehouse);
});
