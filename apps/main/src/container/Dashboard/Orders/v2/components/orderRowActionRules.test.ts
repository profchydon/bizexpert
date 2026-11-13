import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IOrder } from "@/types/orders";
import {
  getSignatureActionLabel,
  hasTransactionReference,
  isSignatureActionAvailable,
  isSignatureCurrentlyRequired,
} from "./orderRowActionRules";

function makeOrder(overrides: Partial<IOrder> = {}): IOrder {
  return {
    type: "onboarding",
    status: "pending",
    signature_requested: "not_requested",
    sub_orders: [{ type: "onboarding" }],
    ...overrides,
  } as unknown as IOrder;
}

describe("hasTransactionReference", () => {
  it("is true only when a transaction id exists", () => {
    assert.equal(
      hasTransactionReference(makeOrder({ transaction_id: "tx" })),
      true,
    );
    assert.equal(
      hasTransactionReference(makeOrder({ transaction_id: null })),
      false,
    );
    assert.equal(hasTransactionReference(undefined), false);
  });
});

describe("isSignatureActionAvailable", () => {
  it("shows for a standard updatable order", () => {
    assert.equal(isSignatureActionAvailable(makeOrder()), true);
  });

  it("hides for buy_to_storage orders", () => {
    assert.equal(
      isSignatureActionAvailable(makeOrder({ type: "buy_to_storage" })),
      false,
    );
  });

  it("hides for storage-only sub orders", () => {
    assert.equal(
      isSignatureActionAvailable(
        makeOrder({ sub_orders: [{ type: "storage" }] as never }),
      ),
      false,
    );
  });

  it("hides when signature is partially requested", () => {
    assert.equal(
      isSignatureActionAvailable(
        makeOrder({ signature_requested: "partially_requested" } as never),
      ),
      false,
    );
  });

  it("hides for locked/completed statuses", () => {
    assert.equal(
      isSignatureActionAvailable(makeOrder({ status: "delivered" } as never)),
      false,
    );
  });
});

describe("signature label", () => {
  it("uses enable copy when not currently required", () => {
    const order = makeOrder({ signature_requested: "not_requested" } as never);
    assert.equal(isSignatureCurrentlyRequired(order), false);
    assert.equal(
      getSignatureActionLabel(order),
      "Enable signature requirement",
    );
  });

  it("uses remove copy when currently required", () => {
    const order = makeOrder({ signature_requested: "requested" } as never);
    assert.equal(isSignatureCurrentlyRequired(order), true);
    assert.equal(
      getSignatureActionLabel(order),
      "Remove signature requirement",
    );
  });
});
