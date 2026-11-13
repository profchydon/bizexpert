import assert from "node:assert/strict";
import test from "node:test";
import {
  getTransactionDetailActionPresentation,
  resolveTransactionDetailClick,
  shouldShowTransactionDetailAction,
} from "./transactionDetailActionsPresentation";

test("partial refund shows an enabled View receipt action", () => {
  const presentation = getTransactionDetailActionPresentation("Partial Refund");

  assert.equal(presentation.label, "View receipt");
  assert.equal(presentation.disabled, false);
  assert.equal(presentation.canOpenReceipt, true);
});

test("fulfilled shows View receipt", () => {
  const presentation = getTransactionDetailActionPresentation("Fulfilled");

  assert.equal(presentation.label, "View receipt");
  assert.equal(presentation.disabled, false);
});

test("cancelled actions stay disabled", () => {
  const presentation = getTransactionDetailActionPresentation("Canceled");

  assert.equal(presentation.label, "Cancelled");
  assert.equal(presentation.disabled, true);
});

test("hides View receipt when invoice is null", () => {
  assert.equal(shouldShowTransactionDetailAction("Fulfilled", null), false);
  assert.equal(
    shouldShowTransactionDetailAction("Successful", undefined),
    false,
  );
  assert.equal(
    shouldShowTransactionDetailAction("Fulfilled", {
      url: "https://invoice.example",
    }),
    true,
  );
});

test("keeps retry and cancelled actions when invoice is null", () => {
  assert.equal(shouldShowTransactionDetailAction("Failed", null), true);
  assert.equal(shouldShowTransactionDetailAction("Canceled", null), true);
});

const paymentLink = "https://checkout.stripe.com/c/pay/cs_test_pending";

test("Click to pay opens the transaction payment link", () => {
  assert.deepEqual(
    resolveTransactionDetailClick({
      status: "Pending",
      paymentLink,
    }),
    { type: "pay", url: paymentLink },
  );
});

test("Retry payment opens the transaction payment link", () => {
  assert.deepEqual(
    resolveTransactionDetailClick({
      status: "Failed",
      paymentLink,
    }),
    { type: "pay", url: paymentLink },
  );
});

test("pay actions stay closed without a safe payment link", () => {
  assert.deepEqual(
    resolveTransactionDetailClick({
      status: "Pending",
      paymentLink: null,
    }),
    { type: "none" },
  );
  assert.deepEqual(
    resolveTransactionDetailClick({
      status: "Failed",
      paymentLink: "javascript:alert(1)",
    }),
    { type: "none" },
  );
});

test("View receipt still opens the invoice url", () => {
  assert.deepEqual(
    resolveTransactionDetailClick({
      status: "Fulfilled",
      paymentLink,
      invoiceUrl: "https://invoice.example/receipt",
    }),
    { type: "receipt", url: "https://invoice.example/receipt" },
  );
});

test("cancelled does not open the payment link", () => {
  assert.deepEqual(
    resolveTransactionDetailClick({
      status: "Canceled",
      paymentLink,
    }),
    { type: "none" },
  );
});
