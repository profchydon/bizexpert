import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { orderSummaryFulfilmentLabel } from "./orderSummaryCartItemView";

describe("orderSummaryFulfilmentLabel", () => {
  it("formats a fulfilment date for the order summary", () => {
    assert.equal(
      orderSummaryFulfilmentLabel("2026-10-23"),
      "Fulfilment date Oct 23, 2026",
    );
  });

  it("returns null when the date is missing or invalid", () => {
    assert.equal(orderSummaryFulfilmentLabel(undefined), null);
    assert.equal(orderSummaryFulfilmentLabel(""), null);
    assert.equal(orderSummaryFulfilmentLabel("not-a-date"), null);
  });
});
