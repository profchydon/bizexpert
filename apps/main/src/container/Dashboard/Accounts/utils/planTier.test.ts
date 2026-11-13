import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveAccountsPlanTier, showScalePlanNotice } from "./planTier";

describe("showScalePlanNotice", () => {
  it("stays hidden while the subscription plan is still loading", () => {
    assert.equal(showScalePlanNotice({ ready: false, tier: "procure" }), false);
  });

  it("stays hidden for an active Scale plan", () => {
    assert.equal(showScalePlanNotice({ ready: true, tier: "scale" }), false);
  });

  it("shows once the plan is known to be below Scale", () => {
    assert.equal(showScalePlanNotice({ ready: true, tier: "operate" }), true);
    assert.equal(showScalePlanNotice({ ready: true, tier: "procure" }), true);
  });
});

describe("resolveAccountsPlanTier", () => {
  it("prefers the subscription contract plan over the legacy login plan", () => {
    assert.equal(
      resolveAccountsPlanTier(
        { slug: "scale", name: "Scale" },
        { slug: "procure", name: "Procure" },
      ),
      "scale",
    );
  });

  it("uses the contract plan even when it is lower than the legacy plan", () => {
    assert.equal(
      resolveAccountsPlanTier(
        { slug: "manage", name: "Manage" },
        { slug: "scale", name: "Scale" },
      ),
      "manage",
    );
  });

  it("falls back to the legacy login plan while the contract plan is unknown", () => {
    assert.equal(
      resolveAccountsPlanTier(undefined, { slug: "operate", name: "Operate" }),
      "operate",
    );
    assert.equal(resolveAccountsPlanTier(null, { name: "Procure" }), "procure");
  });

  it("reads the slug before the display name", () => {
    assert.equal(
      resolveAccountsPlanTier({ slug: "scale", name: "Rayda Enterprise" }),
      "scale",
    );
  });

  it("keeps the existing scale default when no plan is known", () => {
    assert.equal(resolveAccountsPlanTier(null, null), "scale");
  });
});
