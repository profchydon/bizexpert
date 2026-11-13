import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveStorageCustomerPlan } from "./resolveStorageCustomerPlan";

describe("resolveStorageCustomerPlan", () => {
  it("maps product plan tiers onto storage buyback eligibility", () => {
    assert.equal(
      resolveStorageCustomerPlan({ slug: "scale", name: "Scale" }),
      "enterprise",
    );
    assert.equal(
      resolveStorageCustomerPlan({ slug: "operate", name: "Operate" }),
      "operate",
    );
    assert.equal(
      resolveStorageCustomerPlan({ slug: "manage", name: "Manage" }),
      "basic",
    );
    assert.equal(
      resolveStorageCustomerPlan({ slug: "procure", name: "Procure" }),
      "basic",
    );
  });

  it("defaults a missing plan to enterprise like Accounts scale fallback", () => {
    assert.equal(resolveStorageCustomerPlan(null), "enterprise");
    assert.equal(resolveStorageCustomerPlan(undefined), "enterprise");
  });
});
