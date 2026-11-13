import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapBillingEntityOptions } from "./mapBillingEntityOptions";
import type { Subsidiary } from "../types";

describe("mapBillingEntityOptions", () => {
  it("includes operational self-billing entities", () => {
    const subsidiaries: Subsidiary[] = [
      {
        id: "primary",
        name: "Intensa",
        region: "United Kingdom",
        currency: "GBP",
        admins: [],
        status: "operational",
        officesCount: 1,
        creditState: "assessing",
        cardOnFile: true,
        createdDaysAgo: 0,
        createdBy: "ops@intensa.com",
        isPrimary: true,
        billingMode: "self",
        billingEntityId: "primary",
        billingEntityName: "Intensa",
        billingCurrency: "GBP",
      },
      {
        id: "delegated-au",
        name: "Rayda Australia",
        region: "Australia",
        currency: "AUD",
        admins: [],
        status: "delegated",
        officesCount: 0,
        creditState: "card-only",
        cardOnFile: false,
        createdDaysAgo: 1,
        createdBy: "ops@rayda.com",
        billingMode: "delegated",
        billingEntityId: "primary",
        billingEntityName: "Intensa",
        billingCurrency: "GBP",
      },
    ];

    const options = mapBillingEntityOptions(subsidiaries);
    assert.equal(options.length, 1);
    assert.equal(options[0]?.value, "primary");
    assert.equal(options[0]?.currency, "GBP");
  });

  it("includes card-pending self-billing entities as delegated payers", () => {
    const subsidiaries: Subsidiary[] = [
      {
        id: "primary",
        name: "Intensa",
        region: "United Kingdom",
        currency: "GBP",
        admins: [],
        status: "card-pending",
        officesCount: 1,
        creditState: "card-only",
        cardOnFile: false,
        createdDaysAgo: 0,
        createdBy: "ops@intensa.com",
        isPrimary: true,
        billingMode: "self",
        billingEntityId: "primary",
        billingEntityName: "Intensa",
        billingCurrency: "GBP",
      },
    ];

    const options = mapBillingEntityOptions(subsidiaries);
    assert.equal(options.length, 1);
    assert.equal(options[0]?.label, "Intensa");
  });
});
