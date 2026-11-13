import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Subsidiary } from "../types";
import { mergeAccountsEntities } from "./mergeAccountsEntities";

const primary: Subsidiary = {
  id: "primary",
  name: "Primary Co",
  region: "United States",
  currency: "USD",
  admins: [],
  status: "operational",
  officesCount: 1,
  creditState: "active-credit",
  cardOnFile: true,
  createdDaysAgo: 1,
  createdBy: "Admin",
  isPrimary: true,
  billingMode: "self",
  billingEntityId: "primary",
  billingEntityName: "Primary Co",
  billingCurrency: "USD",
};

const secondary: Subsidiary = {
  ...primary,
  id: "secondary",
  name: "London HQ Entity",
  region: "United Kingdom",
  currency: "GBP",
  isPrimary: false,
  billingEntityId: "secondary",
  billingEntityName: "London HQ Entity",
  billingCurrency: "GBP",
};

describe("mergeAccountsEntities", () => {
  it("keeps only the primary entity on non-scale plans by default", () => {
    const merged = mergeAccountsEntities([primary, secondary], "operate", []);

    assert.deepEqual(
      merged.map((entity) => entity.id),
      ["primary"],
    );
  });

  it("returns full API search results on non-scale plans", () => {
    const merged = mergeAccountsEntities([secondary], "operate", [], {
      searchActive: true,
    });

    assert.deepEqual(
      merged.map((entity) => entity.id),
      ["secondary"],
    );
  });

  it("returns full API filter results on scale plans", () => {
    const merged = mergeAccountsEntities([secondary], "scale", [primary], {
      filterActive: true,
    });

    assert.deepEqual(
      merged.map((entity) => entity.id),
      ["secondary"],
    );
  });
});
