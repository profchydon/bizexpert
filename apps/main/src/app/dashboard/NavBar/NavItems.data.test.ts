import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { items } from "./NavItems.data";

describe("dashboard nav items", () => {
  it("shows Kit Library before Catalog Policy in the Catalogs menu", () => {
    const catalogs = items("/dashboard/kits").find(
      (item) => item.id === "catalogs",
    );

    assert.deepEqual(
      catalogs?.children?.map((child) => child.name),
      ["Kit Library", "Catalog Policy", "Approvals"],
    );
  });

  it("keeps Catalog Policy visible and opens the upgrade dialog when the plan does not include it", () => {
    const catalogs = items("/dashboard/orders", undefined, "entity-1", {
      search: "tab=open",
      catalogPolicyOn: false,
    }).find((item) => item.id === "catalogs");
    const policy = catalogs?.children?.find(
      (child) => child.id === "catalog-policies",
    );
    const kits = catalogs?.children?.find(
      (child) => child.id === "kit-library",
    );

    assert.equal(catalogs?.removeNav, undefined);
    assert.equal(
      policy?.link,
      "/dashboard/orders?tab=open&catalogPolicyUpgrade=1&entity=entity-1",
    );
    assert.equal(kits?.link, "/dashboard/kits?entity=entity-1");
  });

  it("hides Fleet Insights from the dashboard menu", () => {
    const fleetInsights = items("/dashboard/fleet-insights").find(
      (item) => item.id === "fleet-insights",
    );

    assert.equal(fleetInsights?.removeNav, true);
  });
});
