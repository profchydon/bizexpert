import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildCompanyFields } from "./companyInfoFields";

describe("company info fields", () => {
  it("renders a plan badge and a muted trade name when none is stored", () => {
    const fields = buildCompanyFields({
      created_at: "2025-01-07T00:00:00.000Z",
      phone: "+2348000000000",
      email: "ops@acme.com",
      website: "acme.com",
      size: "11-50",
      subscription: { plan: { name: "Lite Plan" } },
    });

    assert.equal(
      fields.find((field) => field.label === "Trade name")?.value,
      "Not set",
    );
    assert.equal(
      fields.find((field) => field.label === "Trade name")?.muted,
      true,
    );
    assert.equal(
      fields.find((field) => field.label === "Subscription plan")?.badge,
      true,
    );
  });

  it("keeps a stored trade name and marks empty contact fields", () => {
    const fields = buildCompanyFields({
      trading_name: "Acme",
      phone: "  ",
      subscription: null,
    });

    assert.equal(
      fields.find((field) => field.label === "Trade name")?.value,
      "Acme",
    );
    assert.equal(
      fields.find((field) => field.label === "Phone number")?.muted,
      true,
    );
    assert.equal(
      fields.find((field) => field.label === "Subscription plan")?.muted,
      true,
    );
  });
});
