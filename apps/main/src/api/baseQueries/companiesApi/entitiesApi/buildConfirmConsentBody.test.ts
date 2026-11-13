import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildConfirmConsentBody } from "./buildConfirmConsentBody";

describe("buildConfirmConsentBody", () => {
  it("includes session_id when present", () => {
    assert.deepEqual(buildConfirmConsentBody("cs_test_a1b2c3"), {
      session_id: "cs_test_a1b2c3",
    });
  });

  it("omits the body for NGN entities without a session id", () => {
    assert.equal(buildConfirmConsentBody(null), undefined);
    assert.equal(buildConfirmConsentBody(""), undefined);
    assert.equal(buildConfirmConsentBody("   "), undefined);
  });
});
