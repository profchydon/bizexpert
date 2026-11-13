import assert from "node:assert/strict";
import test from "node:test";
import { cancellationSubmitResult } from "./cancellationSubmitResult";

test("cancellationSubmitResult returns the refund preview from an instant cancel response", () => {
  const result = cancellationSubmitResult({
    data: {
      instant: true,
      refund_preview: {
        currency: "$",
        payment_method: "Card",
        rail: "card",
        amount_paid: 2507,
        spent_services: 0,
        refundable_before_fee: 2507,
        gateway_fee: 75.43,
        net_refund: 2431.57,
        rows: [],
        policy_rules: [],
      },
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.instant, true);
  assert.equal(result.refund_preview?.net_refund, 2431.57);
});

test("cancellationSubmitResult does not invent a preview when cancel returns none", () => {
  const result = cancellationSubmitResult({});

  assert.equal(result.ok, true);
  assert.equal(result.instant, false);
  assert.equal(result.refund_preview, undefined);
});
