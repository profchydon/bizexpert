import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getCatalogPolicyOrderStatusMeta } from "./status";

describe("employee catalog policy order status", () => {
  it("shows RFQ pending status before the base order status", () => {
    assert.deepEqual(
      getCatalogPolicyOrderStatusMeta({
        id: "request-1",
        rfqs: [{ id: "rfq-1", status: "pending" }],
        status: "pending",
      }),
      { label: "Awaiting RFQ response", variant: "destructive" },
    );
  });

  it("shows quote-ready status when the RFQ can be acted on", () => {
    assert.deepEqual(
      getCatalogPolicyOrderStatusMeta({
        id: "request-1",
        rfqs: [{ id: "rfq-1", status: "waiting_for_action" }],
        status: "pending",
      }),
      { label: "RFQ quote ready", variant: "blue" },
    );
  });

  it("falls back to a readable order request status", () => {
    assert.deepEqual(
      getCatalogPolicyOrderStatusMeta({
        id: "request-1",
        status: "awaiting_approval",
      }),
      { label: "Awaiting Approval", variant: "pending" },
    );
  });
});
