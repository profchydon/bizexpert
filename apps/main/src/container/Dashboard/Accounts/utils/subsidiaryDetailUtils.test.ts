import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatCreatedDate } from "./formatCreatedDate";
import { delegatedCostCentres } from "./delegatedCostCentres";
import { formatCurrencyAmount } from "./formatCurrencyAmount";
import { planSupportsCredit } from "./planCredit";
import { planOfficeLimit } from "./planLimits";
import { subsidiariesSeed } from "../data/subsidiariesSeed";

describe("formatCreatedDate", () => {
  it("returns Today for newly created entities", () => {
    assert.equal(formatCreatedDate(0), "Today");
  });

  it("formats older dates in UTC", () => {
    assert.match(formatCreatedDate(512), /\d{1,2} \w{3} \d{4}/);
  });
});

describe("planCredit", () => {
  it("excludes Procure from Net-30 credit", () => {
    assert.equal(planSupportsCredit("procure"), false);
    assert.equal(planSupportsCredit("scale"), true);
  });
});

describe("planOfficeLimit", () => {
  it("returns finite limits for non-scale plans", () => {
    assert.equal(planOfficeLimit("procure"), 1);
    assert.equal(planOfficeLimit("manage"), 5);
  });

  it("returns Infinity for Scale", () => {
    assert.equal(planOfficeLimit("scale"), Infinity);
  });
});

describe("delegatedCostCentres", () => {
  it("returns subsidiaries billed through the given entity", () => {
    const centres = delegatedCostCentres("sub-uk", subsidiariesSeed);
    assert.equal(centres.length, 1);
    assert.equal(centres[0]?.id, "sub-ng");
  });
});

describe("formatCurrencyAmount", () => {
  it("prefixes values with the currency symbol", () => {
    assert.match(formatCurrencyAmount("GBP", 4820), /4,820/);
  });
});
