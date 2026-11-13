import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Subsidiary } from "../types";
import {
  filterSubsidiaries,
  sortSubsidiaries,
  toggleSort,
} from "./sortSubsidiaries";
import { resolvePlanTier } from "./planTier";

const sample: Subsidiary[] = [
  {
    id: "b",
    name: "Beta Ltd",
    region: "Germany",
    currency: "EUR",
    admins: [],
    status: "operational",
    officesCount: 2,
    creditState: "assessing",
    cardOnFile: true,
    createdDaysAgo: 10,
    createdBy: "Admin",
    billingMode: "self",
    billingEntityId: "b",
    billingEntityName: "Beta Ltd",
    billingCurrency: "EUR",
  },
  {
    id: "a",
    name: "Acme Inc",
    region: "United States",
    currency: "USD",
    admins: [],
    status: "card-pending",
    officesCount: 4,
    creditState: "card-only",
    cardOnFile: false,
    createdDaysAgo: 100,
    createdBy: "Admin",
    isPrimary: true,
    billingMode: "self",
    billingEntityId: "a",
    billingEntityName: "Acme Inc",
    billingCurrency: "USD",
  },
];

describe("resolvePlanTier", () => {
  it("maps subscription plan names to plan tiers", () => {
    assert.equal(resolvePlanTier("Scale Annual"), "scale");
    assert.equal(resolvePlanTier("Operate"), "operate");
    assert.equal(resolvePlanTier("Manage"), "manage");
    assert.equal(resolvePlanTier("Procure"), "procure");
  });

  it("defaults to scale when plan name is missing for seed-backed accounts", () => {
    assert.equal(resolvePlanTier(undefined), "scale");
    assert.equal(resolvePlanTier(null), "scale");
    assert.equal(resolvePlanTier(""), "scale");
    assert.equal(resolvePlanTier("   "), "scale");
  });
});

describe("filterSubsidiaries", () => {
  it("filters by query and status", () => {
    const filtered = filterSubsidiaries(sample, "beta", ["operational"]);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.name, "Beta Ltd");
  });
});

describe("sortSubsidiaries", () => {
  it("keeps the primary entity first", () => {
    const sorted = sortSubsidiaries(sample, { column: "", direction: "asc" });
    assert.equal(sorted[0]?.isPrimary, true);
  });

  it("sorts by name when requested", () => {
    const sorted = sortSubsidiaries(sample, {
      column: "name",
      direction: "asc",
    });
    assert.equal(sorted[0]?.name, "Acme Inc");
    assert.equal(sorted[1]?.name, "Beta Ltd");
  });
});

describe("toggleSort", () => {
  it("switches direction on repeated column clicks", () => {
    assert.deepEqual(toggleSort({ column: "name", direction: "asc" }, "name"), {
      column: "name",
      direction: "desc",
    });
    assert.deepEqual(
      toggleSort({ column: "region", direction: "asc" }, "name"),
      {
        column: "name",
        direction: "asc",
      },
    );
  });
});
