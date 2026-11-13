import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import { join } from "node:path";

import {
  paymentRedirectProperties,
  trackOrderPaid,
  trackOrderPaymentCancelled,
} from "./paymentAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";

function createCaptureRecorder() {
  const captured: Array<{
    event: string;
    properties?: Record<string, unknown>;
  }> = [];
  setAnalyticsClientForTests({
    identify: () => {},
    group: () => {},
    reset: () => {},
    capture: (event, properties) => {
      captured.push({
        event,
        properties: properties as Record<string, unknown>,
      });
    },
    opt_out_capturing: () => {},
    opt_in_capturing: () => {},
    has_opted_out_capturing: () => false,
  });
  return captured;
}

afterEach(() => {
  resetAnalyticsClientForTests();
});

describe("payment analytics events", () => {
  it("tracks order payment cancelled with join ids", () => {
    const captured = createCaptureRecorder();
    trackOrderPaymentCancelled({
      order_id: "order-1",
      order_flow: "equip_employee",
    });
    assert.equal(captured[0]?.event, "Order Payment Cancelled");
    assert.deepEqual(captured[0]?.properties, {
      order_id: "order-1",
      order_flow: "equip_employee",
    });
  });

  it("omits missing cancelled properties", () => {
    const captured = createCaptureRecorder();
    trackOrderPaymentCancelled();
    assert.equal(captured[0]?.event, "Order Payment Cancelled");
    assert.equal(captured[0]?.properties, undefined);
  });

  it("tracks order paid with join ids", () => {
    const captured = createCaptureRecorder();
    trackOrderPaid({ order_id: "order-1", order_flow: "approval" });
    assert.equal(captured[0]?.event, "Order Paid");
    assert.deepEqual(captured[0]?.properties, {
      order_id: "order-1",
      order_flow: "approval",
    });
  });

  it("builds redirect properties without empty order_id", () => {
    assert.deepEqual(paymentRedirectProperties("onboarding", ""), {
      order_flow: "onboarding",
    });
    assert.deepEqual(paymentRedirectProperties("storage-actions", "ord-2"), {
      order_id: "ord-2",
      order_flow: "storage-actions",
    });
  });
});

describe("payment analytics call sites", () => {
  it("stashes order ids on redirect and fires paid/cancelled on return", () => {
    const redirect = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/PaymentMethods/usePaymentRedirect.ts",
      ),
      "utf8",
    );
    const cancelled = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/PaymentMethods/useCancelledCheckoutReturn.ts",
      ),
      "utf8",
    );
    const result = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Transactions/TransactionNestedPages/useTransactionPaymentResult.ts",
      ),
      "utf8",
    );
    const payment = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/useOrderSummaryPayment.ts",
      ),
      "utf8",
    );

    assert.match(redirect, /order_id: analytics.order_id/);
    assert.match(cancelled, /trackOrderPaymentCancelled/);
    assert.match(result, /trackOrderPaid/);
    assert.match(payment, /paymentRedirectProperties\("equip_employee"/);
    assert.match(payment, /paymentRedirectProperties\("approval"/);
    assert.match(payment, /paymentRedirectProperties\("storage-actions"/);
    assert.match(payment, /paymentRedirectProperties\(orderFlow/);
  });
});
