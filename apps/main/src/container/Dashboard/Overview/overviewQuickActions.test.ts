import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isOverviewQuickActionEnabled,
  type OverviewQuickAction,
} from "./overviewQuickActionRules";

const catalogAction: OverviewQuickAction = {
  id: "action-catalog",
  title: "Catalogs",
  description: "Create organized equipment lists for each department.",
  cta: "Create catalog",
  href: "/dashboard/catalog-policies",
  featureGate: "Catalog",
};

test("catalog quick action respects the Catalog feature gate", () => {
  assert.equal(isOverviewQuickActionEnabled(catalogAction, ["Catalog"]), true);
  assert.equal(isOverviewQuickActionEnabled(catalogAction, []), false);
  assert.equal(isOverviewQuickActionEnabled(catalogAction, undefined), false);
});

test("quick actions without a feature gate stay enabled", () => {
  const equipAction: OverviewQuickAction = {
    id: "action-equip",
    title: "Equip your employee",
    description: "Give employees top notch quality work tools.",
    cta: "Equip employee",
    href: "/dashboard/employees",
  };

  assert.equal(isOverviewQuickActionEnabled(equipAction, []), true);
});
