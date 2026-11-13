import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  paymentVerifyRedirectPath,
  shouldApplyPaymentVerify,
} from "./paymentVerify";

describe("paymentVerify", () => {
  it("applies a verify result only once per kind", () => {
    assert.equal(shouldApplyPaymentVerify(null, "success", true), true);
    assert.equal(shouldApplyPaymentVerify("success", "success", true), false);
    assert.equal(shouldApplyPaymentVerify(null, "success", false), false);
    assert.equal(shouldApplyPaymentVerify("error", "error", true), false);
    assert.equal(shouldApplyPaymentVerify(null, "error", true), true);
  });

  it("routes verified payments to the matching transactions instance", () => {
    assert.equal(
      paymentVerifyRedirectPath("success"),
      "/dashboard/transactions?success_instance=true",
    );
    assert.equal(
      paymentVerifyRedirectPath("error"),
      "/dashboard/transactions?error_instance=true",
    );
  });
});
