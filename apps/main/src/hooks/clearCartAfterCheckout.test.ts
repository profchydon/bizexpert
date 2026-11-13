import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { shouldClearCartForCheckout } from "./clearCartAfterCheckout";

describe("shouldClearCartForCheckout", () => {
  it("clears once when checkout lands with a transaction id", () => {
    assert.equal(
      shouldClearCartForCheckout({
        enabled: true,
        transactionId: "tx-1",
        clearedForTransactionId: null,
      }),
      true,
    );
    assert.equal(
      shouldClearCartForCheckout({
        enabled: true,
        transactionId: "tx-1",
        clearedForTransactionId: "tx-1",
      }),
      false,
    );
  });

  it("skips when order is not loaded or checkout context is missing", () => {
    assert.equal(
      shouldClearCartForCheckout({
        enabled: false,
        transactionId: "tx-1",
        clearedForTransactionId: null,
      }),
      false,
    );
    assert.equal(
      shouldClearCartForCheckout({
        enabled: true,
        transactionId: null,
        clearedForTransactionId: null,
      }),
      false,
    );
  });
});
