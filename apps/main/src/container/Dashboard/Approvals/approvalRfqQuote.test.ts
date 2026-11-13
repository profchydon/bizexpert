import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canSubmitApprovalRfqQuote,
  clearCartAfterApprovalRfqAccept,
} from "./approvalRfqQuote";

describe("approval RFQ quote actions", () => {
  it("requires company, response, and selected response devices", () => {
    assert.equal(
      canSubmitApprovalRfqQuote({
        companyId: "company-1",
        responseId: "response-1",
        selectedDeviceIds: ["device-1"],
      }),
      true,
    );
    assert.equal(
      canSubmitApprovalRfqQuote({
        companyId: "company-1",
        responseId: "response-1",
        selectedDeviceIds: [],
      }),
      false,
    );
  });

  it("rejects incomplete quote acceptance payloads", () => {
    assert.equal(
      canSubmitApprovalRfqQuote({
        companyId: undefined,
        responseId: "response-1",
        selectedDeviceIds: ["device-1"],
      }),
      false,
    );
    assert.equal(
      canSubmitApprovalRfqQuote({
        companyId: "company-1",
        responseId: undefined,
        selectedDeviceIds: ["device-1"],
      }),
      false,
    );
  });

  it("clears the cart only after an RFQ quote is accepted", async () => {
    let clearCount = 0;
    const clearCart = () => {
      clearCount += 1;
    };

    assert.equal(
      await clearCartAfterApprovalRfqAccept({
        clearCart,
        wasAccepted: false,
      }),
      false,
    );
    assert.equal(clearCount, 0);

    assert.equal(
      await clearCartAfterApprovalRfqAccept({
        clearCart,
        wasAccepted: true,
      }),
      true,
    );
    assert.equal(clearCount, 1);
  });
});
