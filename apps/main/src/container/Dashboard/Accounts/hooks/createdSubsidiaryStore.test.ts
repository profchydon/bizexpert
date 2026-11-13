import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addCreatedSubsidiary,
  createdSubsidiaryCount,
  getCreatedSubsidiariesSnapshot,
  resetCreatedSubsidiariesForTests,
} from "../hooks/createdSubsidiaryStore";
import type { Subsidiary } from "../types";

const sample: Subsidiary = {
  id: "sub-test-1",
  name: "Test Entity",
  region: "United States",
  currency: "USD",
  admins: ["Amara Okafor"],
  status: "operational",
  officesCount: 0,
  creditState: "assessing",
  cardOnFile: true,
  createdDaysAgo: 0,
  createdBy: "You",
  billingMode: "self",
  billingEntityId: "sub-test-1",
  billingEntityName: "Test Entity",
  billingCurrency: "USD",
};

describe("createdSubsidiaryStore", () => {
  it("starts empty and prepends created entities", () => {
    resetCreatedSubsidiariesForTests();
    assert.equal(createdSubsidiaryCount(), 0);
    assert.deepEqual(getCreatedSubsidiariesSnapshot(), []);

    addCreatedSubsidiary(sample);
    assert.equal(createdSubsidiaryCount(), 1);
    assert.equal(getCreatedSubsidiariesSnapshot()[0]?.id, "sub-test-1");

    addCreatedSubsidiary({ ...sample, id: "sub-test-2", name: "Second" });
    assert.equal(createdSubsidiaryCount(), 2);
    assert.equal(getCreatedSubsidiariesSnapshot()[0]?.id, "sub-test-2");
  });
});
