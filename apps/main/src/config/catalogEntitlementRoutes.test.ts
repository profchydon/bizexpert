import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  catalogPolicyBlockedHref,
  catalogPolicyUpgradeHref,
  catalogPolicyUpgradeReturnHref,
  isCatalogEntitlementRoute,
} from "./catalogEntitlementRoutes";

describe("catalog entitlement routes", () => {
  it("protects catalog policy routes only", () => {
    assert.equal(
      isCatalogEntitlementRoute("/dashboard/catalog-policies"),
      true,
    );
    assert.equal(
      isCatalogEntitlementRoute("/dashboard/catalog-policies/rules/rule-1"),
      true,
    );
    assert.equal(isCatalogEntitlementRoute("/dashboard/catalogs"), false);
    assert.equal(
      isCatalogEntitlementRoute("/dashboard/kits/kit-1/edit"),
      false,
    );
    assert.equal(isCatalogEntitlementRoute("/dashboard/approvals"), false);
    assert.equal(isCatalogEntitlementRoute("/dashboard/overview"), false);
  });

  it("opens the upgrade dialog on the current page", () => {
    assert.equal(
      catalogPolicyUpgradeHref("/dashboard/orders", "tab=open", "entity-1"),
      "/dashboard/orders?tab=open&catalogPolicyUpgrade=1&entity=entity-1",
    );
    assert.equal(
      catalogPolicyUpgradeReturnHref(
        "/dashboard/orders",
        "tab=open&catalogPolicyUpgrade=1",
      ),
      "/dashboard/orders?tab=open",
    );
    assert.equal(
      catalogPolicyBlockedHref("entity-1"),
      "/dashboard/overview?catalogPolicyUpgrade=1&entity=entity-1",
    );
  });

  it("guards the catalog policy route from the dashboard layout", () => {
    const layout = readFileSync("src/app/dashboard/layout.tsx", "utf8");
    const guard = readFileSync(
      "src/components/SubscriptionRouteGuard.tsx",
      "utf8",
    );
    const wrapper = readFileSync(
      "src/container/Dashboard/Catalogs/CatalogAccessWrapper.tsx",
      "utf8",
    );
    const dialog = readFileSync(
      "src/container/Dashboard/Catalogs/CatalogPolicyUpgradeDialog.tsx",
      "utf8",
    );

    assert.match(layout, /SubscriptionRouteGuard/);
    assert.match(guard, /isCatalogEntitlementRoute/);
    assert.match(guard, /CatalogAccessWrapper/);
    assert.match(guard, /CatalogPolicyUpgradeDialog/);
    assert.match(wrapper, /useEntitlementOn\("catalog_limit"\)/);
    assert.match(wrapper, /PageState isLoading/);
    assert.match(wrapper, /replace\(catalogPolicyBlockedHref/);
    assert.doesNotMatch(wrapper, /PlanUpgradePrompt/);
    assert.match(dialog, /AssetDetailUpgradeDialog/);
  });
});
