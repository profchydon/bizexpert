import assert from "node:assert/strict";
import test from "node:test";
import {
  getTransactionStatusPresentation,
  isOrderRefunded,
} from "./transactionStatusPresentation";

test("invoice PAID status uses the Paid success pill", () => {
  const presentation = getTransactionStatusPresentation("PAID");

  assert.equal(presentation.label, "Paid");
  assert.match(presentation.className, /success/);
});

test("partial refund badge includes refunded and remaining tooltip", () => {
  const presentation = getTransactionStatusPresentation("Partial Refund", {
    refund: 4314.22,
    amount: 4772.25,
    currencySymbol: "£",
  });

  assert.equal(presentation.label, "Partial refund");
  assert.equal(presentation.detail, undefined);
  assert.match(presentation.tooltip ?? "", /4,314.22 refunded/);
  assert.match(presentation.tooltip ?? "", /458.03 still active/);
});

test("isOrderRefunded recognises cancelled parent orders", () => {
  assert.equal(isOrderRefunded("cancelled"), true);
  assert.equal(isOrderRefunded("pending"), false);
});
