import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  conditionVariant,
  formatSourceLabel,
  sourceBadgeVariant,
} from "./equipBadges";
import type { EquipDeviceItem } from "./equipTypes";

const item = (overrides: Partial<EquipDeviceItem>): EquipDeviceItem => ({
  lineId: "l-1",
  productId: "1",
  name: "Device",
  source: "MARKETPLACE",
  origin: "MANUAL",
  unitPrice: 100,
  currency: "USD",
  quantity: 1,
  config: "none",
  ...overrides,
});

describe("conditionVariant", () => {
  it("maps conditions to badge variants", () => {
    assert.equal(conditionVariant("Excellent"), "success");
    assert.equal(conditionVariant("Good"), "blue");
    assert.equal(conditionVariant("Fair"), "pending");
    assert.equal(conditionVariant("Poor"), "error");
    assert.equal(conditionVariant(undefined), "gray");
  });
});

describe("sourceBadgeVariant", () => {
  it("uses condition for storage, warning for RFQ, gray otherwise", () => {
    assert.equal(
      sourceBadgeVariant(item({ source: "STORAGE", condition: "Good" })),
      "blue",
    );
    assert.equal(sourceBadgeVariant(item({ source: "RFQ" })), "pending");
    assert.equal(sourceBadgeVariant(item({ source: "MARKETPLACE" })), "gray");
  });

  it("uses blue for policy-sourced items regardless of source", () => {
    assert.equal(
      sourceBadgeVariant(
        item({ source: "MARKETPLACE", origin: "FROM_POLICY" }),
      ),
      "blue",
    );
  });
});

describe("formatSourceLabel", () => {
  it("labels each source", () => {
    assert.equal(
      formatSourceLabel(item({ source: "STORAGE", condition: "Fair" })),
      "Storage · Fair",
    );
    assert.equal(formatSourceLabel(item({ source: "RFQ" })), "Request quote");
    assert.equal(
      formatSourceLabel(item({ source: "MARKETPLACE" })),
      "Marketplace",
    );
  });

  it("labels policy-sourced items as From policy", () => {
    assert.equal(
      formatSourceLabel(item({ source: "MARKETPLACE", origin: "FROM_POLICY" })),
      "From policy",
    );
  });
});
