import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveEntityCardCaptureUrl } from "./resolveEntityCardCapture";

describe("resolveEntityCardCapture", () => {
  it("returns the hosted capture url from consent", () => {
    assert.equal(
      resolveEntityCardCaptureUrl({
        processor: "stripe",
        url: "https://checkout.stripe.com/pay/cs_test",
        session_id: "cs_test",
      }),
      "https://checkout.stripe.com/pay/cs_test",
    );
  });

  it("returns null when consent has no redirect url", () => {
    assert.equal(
      resolveEntityCardCaptureUrl({
        processor: "ngn_stub",
        card_captured: true,
      }),
      null,
    );
  });
});
