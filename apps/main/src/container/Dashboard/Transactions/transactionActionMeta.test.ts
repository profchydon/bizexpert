import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getInvoiceHostedUrl,
  getInvoiceProcessorId,
  getTransactionDetailAction,
  getTransactionListAction,
  resolveTransactionDisplayStatus,
} from "./transactionActionMeta";

describe("getTransactionListAction", () => {
  it("retries failed rows and views every other instance", () => {
    assert.equal(getTransactionListAction("Failed"), "retry");
    assert.equal(getTransactionListAction("Pending"), "view");
    assert.equal(getTransactionListAction("Fulfilled"), "view");
  });
});

describe("getTransactionDetailAction", () => {
  it("opens the captured invoice url for paid View receipt", () => {
    const action = getTransactionDetailAction({
      status: "Fulfilled",
      invoice: {
        number: "INV-1",
        status: "PAID",
        pdf_url: "https://invoice.example/pdf",
        url: "https://invoice.example/pay",
      },
    });

    assert.equal(action.label, "View receipt");
    assert.equal(action.href, "https://invoice.example/pay");
    assert.equal(action.disabled, false);
  });

  it("keeps a fulfilled credit checkout paid when the invoice is still unpaid", () => {
    const unpaid = getTransactionDetailAction({
      status: "Fulfilled",
      paymentLink: "https://checkout.example/pay",
      invoice: {
        status: "UNPAID",
        url: "https://invoice.example/pay",
      },
    });
    const paid = getTransactionDetailAction({
      status: "Pending",
      paymentLink: "https://checkout.example/pay",
      invoice: {
        status: "PAID",
        url: "https://invoice.example/receipt",
      },
    });

    assert.equal(unpaid?.label, "View receipt");
    assert.equal(unpaid?.href, "https://invoice.example/pay");
    assert.equal(paid?.label, "View receipt");
    assert.equal(paid?.href, "https://invoice.example/receipt");
  });

  it("hides View receipt when invoice is null", () => {
    assert.equal(
      getTransactionDetailAction({
        status: "Fulfilled",
        invoice: null,
      }),
      null,
    );
  });

  it("hides pending Click to pay and uses payment_link for failed Retry payment", () => {
    const pending = getTransactionDetailAction({
      status: "Pending",
      paymentLink: "https://checkout.example/pay",
    });
    const failed = getTransactionDetailAction({
      status: "Failed",
      paymentLink: "https://checkout.example/retry",
    });

    assert.equal(pending, null);
    assert.equal(failed?.label, "Retry payment");
    assert.equal(failed?.disabled, false);
  });

  it("disables cancelled and voided actions", () => {
    assert.equal(
      getTransactionDetailAction({ status: "Canceled" })?.disabled,
      true,
    );
    assert.equal(
      getTransactionDetailAction({ status: "Refunded" })?.label,
      "Voided",
    );
  });
});

describe("invoice helpers", () => {
  it("reads processor id, hosted url, and invoice status from the payload", () => {
    assert.equal(
      getInvoiceProcessorId({ number: "INV-YII8ZNL2-0003" }),
      "INV-YII8ZNL2-0003",
    );
    assert.equal(
      getInvoiceHostedUrl({
        url: "https://invoice.example/pay",
        pdf_url: "https://invoice.example/pdf",
      }),
      "https://invoice.example/pay",
    );
    assert.equal(
      resolveTransactionDisplayStatus({
        status: "Fulfilled",
        invoice: { status: "PAID" },
      }),
      "PAID",
    );
    assert.equal(
      resolveTransactionDisplayStatus({
        status: "Fulfilled",
        invoice: { status: "UNPAID" },
      }),
      "Fulfilled",
    );
    assert.equal(
      resolveTransactionDisplayStatus({
        status: "Fulfilled",
        invoice: { status: "OPEN" },
      }),
      "Fulfilled",
    );
    assert.equal(
      resolveTransactionDisplayStatus({ status: "Pending", invoice: null }),
      "Pending",
    );
  });

  it("does not show Failed when paid_at is set or the transaction is fulfilled", () => {
    assert.equal(
      resolveTransactionDisplayStatus({
        status: "Fulfilled",
        invoice: {
          status: "FAILED",
          paid_at: "2026-09-17T18:19:10.000000Z",
        },
      }),
      "PAID",
    );
    assert.equal(
      resolveTransactionDisplayStatus({
        status: "Fulfilled",
        invoice: { status: "FAILED" },
      }),
      "Fulfilled",
    );
    assert.equal(
      getTransactionDetailAction({
        status: "Fulfilled",
        invoice: {
          status: "FAILED",
          paid_at: "2026-09-17T18:19:10.000000Z",
          url: "https://invoice.example/receipt",
        },
      })?.label,
      "View receipt",
    );
  });
});
