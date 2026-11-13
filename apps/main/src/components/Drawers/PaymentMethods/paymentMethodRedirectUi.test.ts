import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  canClosePaymentMethod,
  canConfirmPaymentMethod,
  paymentConfirmLabel,
} from "./paymentMethodRedirectUi";

const paymentMethods = readFileSync(
  join(process.cwd(), "src/components/Drawers/PaymentMethods/index.tsx"),
  "utf8",
);

describe("paymentMethodRedirectUi", () => {
  it("keeps Confirm on Redirecting while the hosted checkout is opening", () => {
    assert.equal(paymentConfirmLabel(false), "Confirm");
    assert.equal(paymentConfirmLabel(true), "Redirecting…");
  });

  it("blocks dismissing Payment method during redirect", () => {
    assert.equal(canClosePaymentMethod(false), true);
    assert.equal(canClosePaymentMethod(true), false);
  });

  it("lets Wallet confirm without a selected card", () => {
    assert.equal(
      canConfirmPaymentMethod({
        isLoading: false,
        tabState: "Credit",
      }),
      true,
    );
    assert.equal(
      canConfirmPaymentMethod({
        isLoading: true,
        tabState: "Credit",
      }),
      false,
    );
  });

  it("opens the shared checkout drawer for every order-summary flow", () => {
    assert.match(paymentMethods, /OrderSummaryPaymentDrawer/);
  });

  it("still requires a card on the Card tab", () => {
    assert.equal(
      canConfirmPaymentMethod({
        isLoading: false,
        tabState: "Card",
      }),
      false,
    );
    assert.equal(
      canConfirmPaymentMethod({
        isLoading: false,
        tabState: "Card",
        selectedCardValue: "card-1",
      }),
      true,
    );
  });
});
