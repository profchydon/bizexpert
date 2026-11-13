import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  approvalPaymentLink,
  approvalPaymentPayload,
  approvalRedirectUrl,
} from "./approvalPayment";

describe("approval order payment", () => {
  it("builds a redirect URL back to the approval request modal", () => {
    assert.equal(
      approvalRedirectUrl({
        catalogId: "catalog-1",
        orderRequestId: "request-1",
        origin: "https://app.example.com",
      }),
      "https://app.example.com/dashboard/approvals?catalogId=catalog-1&requestId=request-1",
    );
  });

  it("builds a redirect URL back to the employee approval panel", () => {
    assert.equal(
      approvalRedirectUrl({
        catalogId: "catalog-1",
        orderRequestId: "request-1",
        origin: "https://app.example.com",
        returnPath: "/employee",
      }),
      "https://app.example.com/employee?catalogId=catalog-1&requestId=request-1",
    );
  });

  it("falls back to approvals for unsafe return paths", () => {
    assert.equal(
      approvalRedirectUrl({
        catalogId: "catalog-1",
        orderRequestId: "request-1",
        origin: "https://app.example.com",
        returnPath: "https://evil.example.com",
      }),
      "https://app.example.com/dashboard/approvals?catalogId=catalog-1&requestId=request-1",
    );
  });

  it("builds the approval payment payload with fixed safety flags", () => {
    assert.deepEqual(
      approvalPaymentPayload({
        acknowledgeBudgetWarning: true,
        additionalRecipients: ["user@example.com"],
        note: "Include laptop sleeve if available.",
        orderNote: "Deliver during onboarding week.",
        paymentMethod: "Card",
        redirectUrl: "https://app.example.com/dashboard/approvals",
        signatureRequested: true,
      }),
      {
        acknowledge_budget_warning: true,
        additional_recipients: ["user@example.com"],
        confirm_proceed_with_unavailable_items: false,
        debit_wallet_on_approval: false,
        note: "Include laptop sleeve if available.",
        order_note: "Deliver during onboarding week.",
        payment_method: "Card",
        redirect_url: "https://app.example.com/dashboard/approvals",
        signature_requested: true,
      },
    );
  });

  it("extracts the Stripe checkout link from the approval response", () => {
    assert.equal(
      approvalPaymentLink({
        data: {
          payment: {
            link: "https://checkout.stripe.com/pay/cs_test",
          },
        },
      }),
      "https://checkout.stripe.com/pay/cs_test",
    );
    assert.equal(approvalPaymentLink({ data: {} }), null);
  });
});
