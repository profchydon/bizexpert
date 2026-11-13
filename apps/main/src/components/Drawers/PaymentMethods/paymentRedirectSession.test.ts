import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  beginPaymentRedirect,
  cancelledCheckoutReturnPath,
  consumeIfReturnPathMatches,
  hasCheckoutPaymentResult,
  parsePendingPaymentRedirect,
  parsePaymentRedirectTab,
  PAYMENT_REDIRECT_KEY,
  peekPendingPaymentRedirect,
  shouldRestorePaymentDrawer,
  stashPendingPaymentRedirect,
  type StorageLike,
} from "./paymentRedirectSession";

function memoryStorage(initial?: Record<string, string>): StorageLike {
  const data = new Map(Object.entries(initial ?? {}));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

const pending = {
  returnPath: "/dashboard/storage?tab=inventory",
  tabState: "Card" as const,
  selectedCardValue: "card_123",
};

describe("paymentRedirectSession", () => {
  it("accepts only Card and Credit tabs", () => {
    assert.equal(parsePaymentRedirectTab("Card"), "Card");
    assert.equal(parsePaymentRedirectTab("Credit"), "Credit");
    assert.equal(parsePaymentRedirectTab("Bank"), null);
  });

  it("rejects malformed pending redirect payloads", () => {
    assert.equal(parsePendingPaymentRedirect(null), null);
    assert.equal(parsePendingPaymentRedirect("{"), null);
    assert.equal(
      parsePendingPaymentRedirect(
        JSON.stringify({ returnPath: "storage", tabState: "Card" }),
      ),
      null,
    );
    assert.deepEqual(
      parsePendingPaymentRedirect(JSON.stringify(pending)),
      pending,
    );
  });

  it("stashes, peeks, and restores only on the return path", () => {
    const storage = memoryStorage();
    stashPendingPaymentRedirect(pending, storage);
    assert.deepEqual(peekPendingPaymentRedirect(storage), pending);
    assert.equal(
      shouldRestorePaymentDrawer(pending, "/dashboard/transactions"),
      false,
    );
    assert.equal(
      consumeIfReturnPathMatches("/dashboard/transactions", storage),
      null,
    );
    assert.deepEqual(peekPendingPaymentRedirect(storage), pending);
    assert.deepEqual(
      consumeIfReturnPathMatches(pending.returnPath, storage),
      pending,
    );
    assert.equal(storage.getItem(PAYMENT_REDIRECT_KEY), null);
  });

  it("keeps cart checkout recoverable when Stripe is abandoned", () => {
    assert.equal(
      cancelledCheckoutReturnPath(pending, "/dashboard/transactions", false),
      pending.returnPath,
    );
    assert.equal(
      cancelledCheckoutReturnPath(pending, pending.returnPath, false),
      null,
    );
    assert.equal(
      cancelledCheckoutReturnPath(pending, "/dashboard/transactions", true),
      null,
    );
    assert.equal(
      hasCheckoutPaymentResult({
        txRef: "tx_1",
        successInstance: null,
        errorInstance: null,
      }),
      true,
    );
    assert.equal(
      hasCheckoutPaymentResult({
        txRef: null,
        successInstance: null,
        errorInstance: null,
      }),
      false,
    );
  });

  it("stashes then assigns the hosted checkout link", () => {
    const storage = memoryStorage();
    const assigned: string[] = [];
    assert.equal(
      beginPaymentRedirect(
        "https://checkout.stripe.com/c/pay/cs_test",
        pending,
        (url) => assigned.push(url),
        storage,
      ),
      true,
    );
    assert.deepEqual(peekPendingPaymentRedirect(storage), pending);
    assert.deepEqual(assigned, ["https://checkout.stripe.com/c/pay/cs_test"]);
    assert.equal(
      beginPaymentRedirect("", pending, (url) => assigned.push(url), storage),
      false,
    );
    assert.deepEqual(assigned, ["https://checkout.stripe.com/c/pay/cs_test"]);
  });

  it("round-trips optional order join ids", () => {
    const withOrder = {
      ...pending,
      order_id: "order-99",
      order_flow: "storage-actions",
    };
    assert.deepEqual(
      parsePendingPaymentRedirect(JSON.stringify(withOrder)),
      withOrder,
    );
  });
});
