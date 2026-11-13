import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Subsidiary } from "../types";
import { paginateSubsidiaries } from "./sortSubsidiaries";

const row = (id: string): Subsidiary => ({
  id,
  name: id,
  region: "United States",
  currency: "USD",
  admins: [],
  status: "operational",
  officesCount: 0,
  creditState: "card-only",
  cardOnFile: false,
  createdDaysAgo: 1,
  createdBy: "Admin",
  billingMode: "self",
  billingEntityId: id,
  billingEntityName: id,
  billingCurrency: "USD",
});

describe("paginateSubsidiaries", () => {
  it("slices filtered entities into pages", () => {
    const list = Array.from({ length: 20 }, (_, index) =>
      row(`entity-${index + 1}`),
    );
    const page = paginateSubsidiaries(list, 2, 15);

    assert.equal(page.total, 20);
    assert.equal(page.lastPage, 2);
    assert.equal(page.items.length, 5);
    assert.equal(page.items[0]?.id, "entity-16");
  });
});
